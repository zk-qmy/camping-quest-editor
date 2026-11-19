/* ============ INIT ============ */
ensureQuests();
if(P.lesson>=DATA.lessons.length)P.lesson=0;
renderStudent();syncPets();updTeacherBadge();
window.__cq={lessonQuests:lessonQuests,breakdown:breakdown,codeToBlocks:codeToBlocks,load:function(o,blocks){var p=LP();p.code=o.code;p.css=o.css||'';Object.keys(o.pages||{}).forEach(function(n){PG(n).code=o.pages[n];});if(blocks){allToBlocks();P.mode='blocks';}else P.mode='type';saveP();renderStudent();}};