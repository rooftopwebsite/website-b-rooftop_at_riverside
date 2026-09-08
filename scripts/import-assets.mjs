import sharp from 'sharp'; import fs from 'node:fs/promises'; import path from 'node:path';
const RAW='C:/Users/Cami/AppData/Local/Temp/claude/c--Users-Cami-Desktop-RestoExp-website-b-rooftop-at-riverside/e7f04324-8a08-4a0e-9a5a-6b5112cfc3ed/scratchpad/raw';
const OUT='public';
// [archivo origen, destino, ancho max, rotar]
const JOBS=[
 ['14dedf_30ae92d396a543c09f8f84ffe49ab688~mv2.png','brand/logo-lockup.png',1200,0],
 ['14dedf_74ed434a480f44d581972e66aef20a3f~mv2.png','brand/isotype-truck.png',900,0],
 ['526079_71d7c0d734ae427c8faf3067c51899b6~mv2.jpg','images/hero-live-music.jpg',2400,0],
 ['526079_6cbb265faa9c48708cad5fe1923e588d~mv2.jpg','images/venue-guests.jpg',2000,-90],
 ['14dedf_bb158bb053bb41f892f60ec07f67654b~mv2.jpg','images/venue-rooftop.jpg',2000,0],
 ['14dedf_33e55fe8f1f74c01b8a557fc2b20c7b2~mv2.jpg','images/venue-park.jpg',2000,0],
 ['526079_0b925a7df5fc4f499420dda13fcce297~mv2.jpg','images/venue-story.jpg',2000,0],
 ['11062b_e8674ba6ab55403bbb4db28ab9111ffb~mv2.jpg','images/venue-truck-line.jpg',2000,0],
 ['526079_4ea03d5f20d64c4b8e58dd5f3923a5f6~mv2.jpg','images/events/event-a.jpg',1800,0],
 ['526079_c0bd2d9cd428427498708da539a5db7e~mv2.jpg','images/events/event-b.jpg',1800,0],
 ['526079_4b4989fd71894880b13ceeae691ec992~mv2.jpg','images/events/event-c.jpg',1800,0],
 ['526079_50eb2ec4bac240208b3bc5ec7614afd8~mv2.jpg','images/events/event-d.jpg',1800,0],
 ['526079_98c407bd94a44a219c5dc74e96670edb~mv2.jpg','images/game-truck.jpg',1800,0],
 ['11062b_a8b1fc399c4b4b19a703e00812a646a4~mv2.jpg','images/game-controller.jpg',1800,0],
 ['526079_04e12ccd6da44291ac7c96b4ff530a46~mv2.jpg','images/trucks/el-chilango-1.jpg',1600,0],
 ['526079_33ccb8b874144046aa86905f60f820fb~mv2.jpg','images/trucks/el-chilango-2.jpg',1600,0],
 ['526079_3cfc45bc0bc042a69c704066c883500d~mv2.jpeg','images/trucks/el-chilango-3.jpg',1600,0],
 ['11062b_567789504ad040be8bae8e94b3c393ac~mv2.jpg','images/trucks/prime-carvery-1.jpg',1600,0],
 ['11062b_8d771aba921645479337888186918d0c~mv2.jpg','images/trucks/prime-carvery-2.jpg',1600,0],
 ['526079_70b7e8d636054e3ba4434ccba04a953d~mv2.jpeg','images/trucks/prime-carvery-3.jpg',1600,0],
 ['11062b_64de79fd442c4ef98de2d8baa77bdc5f~mv2_d_3840_5760_s_4_2.jpg','images/trucks/seafood-1.jpg',1600,0],
 ['11062b_cf6dcb4e04214c82b701a83832cb9b8b~mv2.jpg','images/trucks/seafood-2.jpg',1600,0],
 ['526079_05bd8539d47844d8b73bd063bd9c27dc~mv2.jpg','images/trucks/tropical-1.jpg',1600,0],
 ['526079_a2ef5f04336945d08b7823e57334eadb~mv2.jpg','images/trucks/tropical-2.jpg',1600,0],
 ['526079_4607a2e45e8e45c386c0e0648c4d3ef3~mv2.jpeg','images/trucks/tropical-3.jpg',1600,0],
 ['526079_d0c342a8d5494bc38b05c7579a07c45d~mv2.jpg','images/trucks/tropical-4.jpg',1600,0],
];
let ok=0,skip=[];
for(const [src,dst,w,rot] of JOBS){
  const from=path.join(RAW,src.replace(/[^\w.~-]/g,'_'));
  try{ await fs.access(from); }catch{ skip.push(src); continue; }
  const to=path.join(OUT,dst); await fs.mkdir(path.dirname(to),{recursive:true});
  let img=sharp(from,{failOn:'none'}); if(rot) img=img.rotate(rot);
  img=img.resize({width:w,withoutEnlargement:true});
  if(dst.endsWith('.png')) await img.png({compressionLevel:9}).toFile(to);
  else await img.jpeg({quality:82,mozjpeg:true}).toFile(to);
  ok++;
}
console.log('procesadas: '+ok+(skip.length?'  faltantes: '+skip.join(', '):''));
