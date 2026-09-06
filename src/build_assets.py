from pathlib import Path
import json,io,base64
import numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import gaussian_filter, distance_transform_edt
from mpl_toolkits.basemap import Basemap, basemap_datadir
from data import R,S
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets';OUT.mkdir(exist_ok=True)
L0,L1,B0,B1=-17,155,-12,75
W,H=2560,1296

def xy(lon,lat):return ((lon-L0)/(L1-L0)*(W-1),(B1-lat)/(B1-B0)*(H-1))
m=Basemap(projection='cyl',llcrnrlon=L0,urcrnrlon=L1,llcrnrlat=B0,urcrnrlat=B1,resolution='l')
mask=Image.new('L',(W,H)); d=ImageDraw.Draw(mask)
for p in m.landpolygons:
 pts=[xy(*v) for v in p.get_coords()]
 if len(pts)>2:d.polygon(pts,fill=255)
for p in m.lakepolygons:
 pts=[xy(*v) for v in p.get_coords()]
 if len(pts)>2:d.polygon(pts,fill=0)
# Political IDs are clipped to actual coastlines, not modern country boundaries.
ids=Image.new('L',(W,H));dd=ImageDraw.Draw(ids)
for r in R:
 for pts in r['polys']:dd.polygon([xy(*v) for v in pts],fill=r['id'])
ia=np.asarray(ids).copy(); ma=np.asarray(mask); ia[ma<128]=0
ids=Image.fromarray(ia);ids.save(OUT/'regions.png',optimize=True)
# Use NASA Blue Marble as a physical base. It does not provide 1550 coastlines or a DEM.
p=Path(basemap_datadir)
im=Image.open(p/'bmng.jpg');iw,ih=im.size
crop=im.crop(((L0+180)/360*iw,(90-B1)/180*ih,(L1+180)/360*iw,(90-B0)/180*ih)).resize((W,H),Image.Resampling.LANCZOS)
rgb=np.asarray(crop).astype(float)
# Slightly open the shadows for legibility, while preserving the physical texture.
rgb=np.clip(rgb*1.04+10,0,255).astype('uint8')
rgba=np.concatenate([rgb,ma[...,None]],axis=2)
Image.fromarray(rgba).save(OUT/'earth.png',optimize=True)
# A schematic relief model: named mountain ranges + broad plateaus. NOT a measured DEM.
NW,NH=641,325
lon,lat=np.meshgrid(np.linspace(L0,L1,NW),np.linspace(B1,B0,NH))
height=np.zeros_like(lon)
def ridge(pts,amp,width):
 global height
 v=np.zeros_like(lon)
 for a,b in zip(pts[:-1],pts[1:]):
  ax,ay=a;bx,by=b;dx=(bx-ax)*.8;dy=by-ay
  px=(lon-ax)*.8;py=lat-ay;t=np.clip((px*dx+py*dy)/(dx*dx+dy*dy),0,1)
  dist=np.sqrt((px-t*dx)**2+(py-t*dy)**2)
  v=np.maximum(v,np.exp(-(dist/width)**2)*amp)
 height=np.maximum(height,v)
ridge([(6,44),(8,46),(11,47),(14,47)],1.55,.78) # Alps
ridge([(-2,43),(2.5,42.5)],1,.55)
ridge([(8,60),(13,65),(20,69)],1.1,1.2)
ridge([(18,49),(23,48),(26,46)],.8,.8)
ridge([(40,43),(44,42.3),(48,41.3)],1.5,.72)
ridge([(28,37),(33,37),(38,38),(43,39)],1.2,1)
ridge([(45,36),(48,33),(53,29)],1.65,1.1)
ridge([(49,36.5),(54,36),(57,37)],1.2,.7)
ridge([(57,53),(60,59),(62,66)],.8,.65)
ridge([(70,35),(75,36.5),(78,34),(82,30),(89,27.5),(96,28)],3.7,1.0)
ridge([(72,39),(77,42),(85,44)],2.4,1.15)
ridge([(84,47),(91,50),(99,51)],1.9,1.2)
ridge([(98,28),(101,32),(104,35)],2.1,1.2)
ridge([(100,20),(102,25),(99,30)],1.2,1.1)
ridge([(130,32),(135,35),(139,38)],1.2,.65)
ridge([(125.5,38),(128.5,41)],1.0,.55)
ridge([(73,11),(74,16),(74,20)],.75,.6)
ridge([(-8,31),(-4,33),(1,35)],1.5,.85)
height+=1.3*np.exp(-((lon-87)/10)**2-((lat-33)/4.5)**2)
# Multi-scale deterministic noise avoids artificial repeating ridges.
rng=np.random.default_rng(1550)
rough=gaussian_filter(rng.standard_normal(height.shape),.7)
broad=gaussian_filter(rng.standard_normal(height.shape),2.2)
rough/=max(float(np.std(rough)),1e-8)
broad/=max(float(np.std(broad)),1e-8)
height*=np.clip(.88+.10*rough+.07*broad,.62,1.18)
small=np.asarray(mask.resize((NW,NH),Image.Resampling.BILINEAR))/255
edge=np.clip(distance_transform_edt(small>.5)/2,0,1)
height=(.18+height)*edge
height[small<.5]=-.08
h16=np.rint(np.clip((height+.1)/6,0,1)*65535).astype('<u2')
# PNG holds uint16 as two color bytes. JS decodes without endianness assumptions.
himg=np.zeros((NH,NW,4),dtype='uint8');himg[:,:,0]=h16&255;himg[:,:,1]=h16>>8;himg[:,:,3]=255
Image.fromarray(himg).save(OUT/'height.png',optimize=True)
for r in R:r.pop('polys',None)
# Keep source envelopes separate for editing and geospatial audit.
import importlib,data
importlib.reload(data)
(ROOT/'src'/'regions-source.json').write_text(json.dumps(data.R,ensure_ascii=False,indent=2),encoding="utf-8")
conf=dict(extent=[L0,L1,B0,B1],mesh=[NW,NH],width=W,height=H,regions=R,sources=S)
(OUT/'data.json').write_text(json.dumps(conf,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('Assets built',len(R),'regions',NW*NH,'vertices')
