/* ============ GUIDE ============ */
var gTab='student';
var GUIDE_STUDENT='<div class="kid">'+
 '<h3>🗺️ Your screen</h3><table><tr><th>Part</th><th>What it is</th></tr>'+
 '<tr><td>Quest board</td><td>Your quest and its tasks, numbered <b>Task 1</b>, <b>Task 2</b>… (usually 1 to 3). The circles at the top are all the quests in this lesson.</td></tr>'+
 '<tr><td>Code or blocks</td><td>Where you build: type code, or drag blocks.</td></tr>'+
 '<tr><td>Your website</td><td>Your page, live. It changes while you work.</td></tr>'+
 '<tr><td>Top bar</td><td>🌙 Night counter (one more night for every quest you finish), lesson, ⌨️ Type / 🧱 Blocks, ⭐ points, 🎒 Collection, 💾 Backup, ❓ Guide.</td></tr></table>'+
 '<h3>🎮 How to play</h3><ol class="steps">'+
 '<li>Pick <b>⌨️ Type</b> to write code, or <b>🧱 Blocks</b> to snap blocks together. You can switch any time: your work comes with you.</li>'+
 '<li>Read the tasks on your quest.</li>'+
 '<li>Build it. A task turns <b style="color:var(--ok)">green ✓</b> when it’s right.</li>'+
 '<li>All green = <b>quest complete</b>! You get ⭐ points and the next quest opens.</li></ol>'+
 '<h3>🎯 See what to build</h3><table><tr><th>Button</th><th>What it shows</th></tr>'+
 '<tr><td><b>🎯 Goal</b> (above your website)</td><td>The finished page. The <b style="color:var(--fire)">orange outline</b> shows what this quest adds.</td></tr>'+
 '<tr><td><b>🎯 See the expected result</b></td><td>Opens the Goal too.</td></tr>'+
 '<tr><td><b>⛶ Bigger</b></td><td>A big window: your website, the goal, or <b>side by side</b>.</td></tr></table>'+
 '<h3>🆘 When you are stuck</h3><ol class="steps">'+
 '<li>Read the <b style="color:#ffb36b">🟠 Almost!</b> message under the task. It tells you what is wrong: the words, a closing tag, or a value.</li>'+
 '<li>Click <b>💡</b> for a hint.</li>'+
 '<li>Look at the <b>🎯 Goal</b>.</li>'+
 '<li>Still sure it is right? Click <b>🙋 It won’t tick? Ask teacher</b>. Your teacher checks your code. If they accept, the task turns green.</li></ol>'+
 '<h3>🏷️ Close your tags!</h3><p>A task only turns green when the tag is closed: <code>&lt;p&gt;Hello&lt;/p&gt;</code>. Some tags never close: <code>&lt;img&gt;</code> <code>&lt;hr&gt;</code> <code>&lt;br&gt;</code> <code>&lt;input&gt;</code> <code>&lt;link&gt;</code>.</p>'+
 '<h3>⌨️ Typing tips</h3><table><tr><th>To…</th><th>Do this</th></tr>'+
 '<tr><td>Indent a line</td><td>Press <b>Tab</b></td></tr>'+
 '<tr><td>Write CSS in its own file</td><td>Some lessons have <b>index.html</b> and <b>style.css</b> tabs. Connect the file in the head: <code>&lt;link rel="stylesheet" href="style.css"&gt;</code></td></tr></table>'+
 '<h3>🧱 Blocks tips</h3><table><tr><th>To…</th><th>Do this</th></tr>'+
 '<tr><td>Add a block</td><td>Drag it from the left into a slot. Page info goes between <code>&lt;head&gt;</code> and <code>&lt;/head&gt;</code>; things you see go between <code>&lt;body&gt;</code> and <code>&lt;/body&gt;</code></td></tr>'+
 '<tr><td>Find a block fast</td><td>Type in <b>🔍 Search</b>: <code>h1</code>, <code>img</code>, <code>nav</code>, <code>color</code>…</td></tr>'+
 '<tr><td>Put blocks inside a list, table or box (like a <code>&lt;nav&gt;</code> menu)</td><td>Drop them on the box’s name bar, or inside its slot</td></tr>'+
 '<tr><td>Put a link or bold words inside a paragraph</td><td>Use <b>paragraph with parts</b>, then drop <b>words</b>, <b>bold words</b> or <b>link</b> into it</td></tr>'+
 '<tr><td>Add <code>id</code>, <code>target</code>…</td><td>Click <b>⚙️</b> on the block</td></tr>'+
 '<tr><td>Give a table, row or cell a style</td><td>Type it in the block’s <code>style=</code> box, like <code>border: 1px solid green; background: lightblue</code></td></tr>'+
 '<tr><td>Remove a block</td><td>Drag it back to the left side</td></tr>'+
 '<tr><td>Make a mistake</td><td>Click <b>↶ Undo</b></td></tr>'+
 '<tr><td>See the real code</td><td>Click <b>Real code</b> above your website</td></tr>'+
 '<tr><td>🧠 Quiz!</td><td>Every 15 to 30 minutes a 🧠 button pops up at the top. Click it and answer the question: a right answer gives you bonus ⭐ points. Be quick: if you wait more than 10 minutes the quiz disappears.</td></tr>'+
 '<tr><td>🎨 Theme</td><td>Change the sky behind your quests: night forest, dawn, sunset, winter or calm dark. It is saved with your progress.</td></tr></table>'+
 '<h3>🏛 The Hall</h3><p>Click <b>🏛 Hall</b> at the top to see finished demo projects. They build on each other: <b>Night Camp</b> grows a little more in every module. Each card shows how many quests and tasks it has.</p><table><tr><th>Button</th><th>What happens</th></tr>'+
 '<tr><td>👀 Open</td><td>Look at the website and its code.</td></tr>'+
 '<tr><td>🎯 Practice</td><td>Build the project again, quest by quest. If it grows from an earlier project, you start with that project’s finished code and only build the new parts.</td></tr>'+
 '<tr><td>✏️ Make it mine</td><td>Build it <b>your way</b>: your own words, colours and pictures. The 💡 shows an idea. <b>📜 Original code</b> shows the real code. The last quest: add one new thing of your own!</td></tr></table>'+
 '<p>Hall projects show in the lesson list at the top. Click <b>⬅ My lessons</b> to go back. Don’t want a project any more? Click <b>🗑 Remove</b> on its card in the Hall (or 🗑 next to ⬅ My lessons). You keep your points.</p>'+
 '<h3>📄 Websites with more pages</h3><p>Some projects have more than one page, like <b>index.html</b> and <b>tips.html</b>. Click the page name above your code (or above your blocks) to switch. The 📄 on a quest tells you which page it is for. Click a link in your website to jump to that page!</p>'+
 '<h3>⭐ Points and prizes</h3><table><tr><th>Quest</th><th>Points</th></tr><tr><td>Easy</td><td>⭐ '+((DATA.points||{}).easy||10)+'</td></tr><tr><td>Medium</td><td>⭐ '+((DATA.points||{}).medium||15)+'</td></tr><tr><td>Hard</td><td>⭐ '+((DATA.points||{}).hard||25)+' + 🎁 a prize item</td></tr></table>'+
 '<p>Open <b>🎒 Collection</b> to spend points. <b>Real prizes</b>: ask your teacher for them. <b>Screen stickers</b>: they appear on your screen!</p>'+
 '<h3>🐾 Stickers</h3><p>Click a sticker to make it jump and talk. Drag it to move it. Click <b>🐾</b> at the top to hide them all. In 🎒 Collection, use <b>✨ Put on screen</b> or <b>Put away</b>.</p>'+
 '<h3>💾 Saving your progress</h3><ol class="steps"><li>Your work saves <b>by itself</b> on this computer. Use the same computer and browser next time.</li><li>After each lesson, click <b>💾 Backup</b> → <b>📋 Copy code</b>, and keep the code (in a note, or send it to your teacher).</li><li>On another computer: <b>💾 Backup</b> → <b>Load my progress</b> → paste the code → <b>Yes, replace my progress</b>.</li></ol><p>Don’t use a private/incognito window: it forgets everything when you close it.</p>'+
 '<h3>↔️ Make a panel bigger</h3><p>Drag the small bar between two panels. Double-click it to go back to normal.</p></div>';
var GUIDE_TEACHER=
 '<h3>The Teacher view</h3><table><tr><th>Tab / button</th><th>What it is for</th></tr>'+
 '<tr><td>📨 Reports</td><td>Tasks the student asked you to check (opens first when some are waiting)</td></tr>'+
 '<tr><td>📚 Lessons</td><td>Add lessons, paste final code, make and edit quests</td></tr>'+
 '<tr><td>🏛 Hall</td><td>Demo projects he can open, practise or make his own</td></tr>'+
 '<tr><td>🧠 Quiz</td><td>The pop-up quiz: switch it on or off, set how often it appears, how long he has to answer before it expires (10 minutes) and how many bonus points a right answer gives, and write the questions</td></tr>'+
 '<tr><td>🎁 Items</td><td>Prizes and screen stickers</td></tr>'+
 '<tr><td>📦 Prizes to give</td><td>Real prizes he bought or won</td></tr>'+
 '<tr><td>⚙️ Settings</td><td>Course name, quest limit, points, PIN, this device’s progress</td></tr>'+
 '<tr><td>❓ Teacher guide</td><td>This guide (the student cannot see it)</td></tr>'+
 '<tr><td>💾 Save to page</td><td>Puts your lessons, items and quiz questions on the page for the student. Needs a <b>teacher account</b>: log in under ⚙️ Settings → 🔑 Teacher account</td></tr>'+
 '<tr><td>Export · Import</td><td>Export copies everything as text. Import pastes a lesson code or export: <b>➕ Add these lessons</b> keeps yours and adds the new ones; <b>Replace everything</b> restores a full backup</td></tr>'+
 '<tr><td>📤 Copy (on a lesson)</td><td>A code for just that lesson, to share with another teacher or account</td></tr>'+
 '<tr><td>▶ Student view</td><td>Back to the editor</td></tr></table>'+
 '<h3>Before the first lesson</h3><ol class="steps"><li>Set a <b>Teacher PIN</b> in ⚙️ Settings.</li><li>Change the items in 🎁 Items to your real prizes, and pick stickers.</li><li>Click <b>💾 Save to page</b>, then share the link with the student.</li><li>On his computer, open the link in a normal (not private) browser window and keep using that browser.</li></ol>'+
 '<h3>Add a lesson</h3><ol class="steps">'+
 '<li><b>📚 Lessons</b> → <b>+ New lesson</b>, and type its name.</li>'+
 '<li>Under <b>Builds on</b>, pick the previous lesson. The student keeps his code, and only the new parts become quests.</li>'+
 '<li>Paste the <b>final code</b> (index.html): the website as it should be at the end of the lesson. If the lesson uses a separate CSS file, paste it in the <b>style.css</b> box. That box is only used when the final code links it with <code>&lt;link rel="stylesheet" href="style.css"&gt;</code>; otherwise clear it (+ New lesson copies the previous lesson’s code as a start).</li>'+
 '<li>Optional: set <b>Max quests</b> and choose <b>Combine into bigger quests</b> or <b>Keep only the first ones</b>. When you change the number, the page asks to apply it right away.</li>'+
 '<li>Click <b>🔨 Break into quests</b>. Use <b>👀 Preview final code</b> to check the goal, then edit any quest.</li>'+
 '<li>Click <b>💾 Save to page</b>.</li></ol>'+
 '<h3>How the final code is split</h3><table><tr><th>Part of the code</th><th>Becomes</th></tr>'+
 '<tr><td>DOCTYPE, head, title, body</td><td>“Build the page” quest (easy)</td></tr>'+
 '<tr><td><code>&lt;link&gt;</code> to style.css</td><td>“Connect the CSS file” task</td></tr>'+
 '<tr><td>Each heading with its text</td><td>One quest per section (easy)</td></tr>'+
 '<tr><td>Lists, pictures, links, page parts (header, nav, main…)</td><td>Medium; a container joins the things inside it</td></tr>'+
 '<tr><td>Tables, forms, flexbox, grid, :hover, ::before, @media, position, animation</td><td>Hard (also gives a prize item)</td></tr>'+
 '<tr><td>Each CSS rule</td><td>One task per line, e.g. “In <code>h1 { }</code> write <code>color: orange;</code>”</td></tr></table>'+
 '<p>A quest has at most 3 tasks (combined quests can have more). Words, important attributes (<code>src</code>, <code>href</code>, <code>width</code>, <code>target</code>…) and closing tags are all checked. CSS is checked on the real page, so <code>red</code> and <code>#ff0000</code> both count.</p>'+
 '<h3>Edit the quests</h3><table><tr><th>You can</th><th>How</th></tr>'+
 '<tr><td>Rename a quest or a task</td><td>Type in its box</td></tr>'+
 '<tr><td>Change difficulty or prize</td><td>The two menus beside the quest name</td></tr>'+
 '<tr><td>Move or delete</td><td>↑ and ✕</td></tr>'+
 '<tr><td>Add something the page cannot check (WIX, a drawn layout, GitHub Pages, explaining)</td><td><b>+ task you tick yourself</b>, then tick it on his screen with <b>✔ Teacher tick</b></td></tr>'+
 '<tr><td>Shorten a long lesson</td><td>Type a number in <b>Max quests</b>, then click <b>Yes</b>. A bigger number offers to rebuild the quests (up to that many).</td></tr>'+
 '<tr><td>Give quests 99 Nights names</td><td><b>✨ Fun quest names</b></td></tr></table>'+
 '<h3>What the student has</h3><table><tr><th>Feature</th><th>What it does</th></tr>'+
 '<tr><td>⌨️ Type / 🧱 Blocks</td><td>Switch any time; his work turns into code or blocks</td></tr>'+
 '<tr><td>🎯 Goal tab and ⛶ Bigger</td><td>The expected result, with this quest’s part outlined in orange; big window and side by side</td></tr>'+
 '<tr><td>🟠 Almost! messages</td><td>Say what is wrong: words, closing tag, value, attributes</td></tr>'+
 '<tr><td>💡 hints</td><td>A short pattern for each task</td></tr>'+
 '<tr><td>🔍 Block search, ⚙️ attributes, “with parts” blocks</td><td>Find any tag; add id/target; put links or bold words inside text</td></tr>'+
 '<tr><td>🙋 Ask teacher</td><td>Sends you a report when a task won’t tick</td></tr>'+
 '<tr><td>Resizable panels</td><td>Drag the bar between panels; double-click resets</td></tr>'+
 '<tr><td>🌙 Night counter</td><td>Goes up by one for every quest he finishes</td></tr>'+
 '<tr><td>💾 Backup</td><td>Copy a code with all his progress; load it on any computer (he is reminded after each lesson)</td></tr></table>'+
 '<h3>📨 Reports</h3><p>When he presses <b>🙋 Ask teacher</b>, the <b>Teacher</b> button shows a red number. In <b>📨 Reports</b>, click <b>👀 See his code</b> to see his code and website, and what the page was checking. <b>✓ Accept</b> counts the task as done; <b>✗ Try again</b> sends him your message. If the check itself is wrong, fix that task in <b>📚 Lessons</b> too.</p>'+
 '<h3>Working with another teacher (or another account)</h3>'+
'<p><b>Teacher account.</b> Only a teacher account can <b>💾 Save to page</b>. On the web page (GitHub) a teacher account is a <b>GitHub account that can edit this project</b>. Log in once under <b>⚙️ Settings → 🔑 Teacher account</b>: type the project as <code>owner/name</code> and paste an access token. The owner first adds the teacher as a <b>collaborator</b> on GitHub, and the token needs <b>Contents: Read and write</b> for this project only. After logging in, Save to page saves to GitHub and the live page updates in a minute or two. The token stays in this browser only, and the PIN is never saved to GitHub.</p>'+
'<p>Without a teacher account you can still make lessons, but the save is refused and the student won’t see them until a teacher account saves (use <b>📤</b> codes to send lessons to her). If two teachers save, the second one is asked to reload first, so nobody’s work is lost.</p>'+
'<table><tr><th>Step</th><th>Who</th><th>What to do</th></tr>'+
'<tr><td>1</td><td>Other teacher</td><td>In <b>📚 Lessons</b>, make the lesson: name, Builds on, final code, <b>🔨 Break into quests</b>.</td></tr>'+
'<tr><td>2</td><td>Other teacher</td><td>Click <b>📤 Copy</b> on the lesson (or, if you clicked Save, use the code in the “can’t save” window), then <b>📋 Copy code</b>.</td></tr>'+
'<tr><td>3</td><td>Other teacher</td><td>Send the code to the owner (chat, email…).</td></tr>'+
'<tr><td>4</td><td>Owner</td><td><b>Teacher → Import</b> → paste → <b>➕ Add these lessons</b>. Check the new lesson in 📚 Lessons.</td></tr>'+
'<tr><td>5</td><td>Owner</td><td><b>💾 Save to page</b>. The student reloads the page and sees the lesson.</td></tr></table>'+
'<p>The code carries the whole lesson: final code, style.css, quests, limit, and any prize item it uses. If a lesson “Builds on” a lesson the owner doesn’t have, it starts from an empty file instead. Lessons are never removed by <b>➕ Add</b>; to change one, the owner can delete the old copy afterwards.</p>'+
'<h3>Items, prizes and stickers</h3><table><tr><th>Setting</th><th>What it does</th></tr>'+
 '<tr><td>Real prize</td><td>Something you hand over. It appears in <b>📦 Prizes to give</b>; tick <b>given</b> when done.</td></tr>'+
 '<tr><td>Screen sticker</td><td>A character on his screen. Pick a motion (walks, runs, hops, rolls, floats, flies, bounces, follows the mouse, climbs, peeks, circles, dances, sleeps, stays still) and a size; <b>▶ Try</b> previews it.</td></tr>'+
 '<tr><td>Photo</td><td>Click the picture to upload. A see-through PNG works best for stickers; a small GIF (under 400 KB) keeps moving.</td></tr>'+
 '<tr><td>Special</td><td>Prize-only: won in hard quests, not bought</td></tr>'+
 '<tr><td>Price</td><td>Points needed in 🎒 Collection</td></tr></table>'+
 '<h3>Saving and sharing</h3><table><tr><th>Topic</th><th>Detail</th></tr>'+
 '<tr><td>Another teacher or account</td><td>Can make lessons but cannot save. See <b>Working with another teacher</b> above.</td></tr>'+
 '<tr><td>Save to page</td><td>New or changed lessons reach the student <b>only after 💾 Save to page</b>. Until then they stay on your computer (the top of this view says “Not saved to the page yet”), and closing this view reminds you. Only a teacher account can save. The student may need to reload the page.</td></tr>'+
 '<tr><td>Student progress</td><td>Saved automatically in the student’s browser (same computer + same browser to continue). Lost in private/incognito windows or if browser data is cleared. Reports and “Prizes to give” are on his computer too.</td></tr>'+
 '<tr><td>💾 Backup code</td><td>The student’s <b>💾 Backup</b> button makes a text code with all his progress (quests, points, items, code, blocks, reports). Keep a copy after each lesson; <b>Load my progress</b> restores it on any computer. It also lets you check his prizes and reports on your own computer.</td></tr>'+
 '<tr><td>Teacher PIN</td><td>Keeps the student out of this view. It is saved as a salted hash, not plain text, and 5 wrong tries lock it for 30 seconds. It still only stops a child, not a determined person with the page file.</td></tr>'+
 '<tr><td>Lesson backups</td><td><b>Export</b> copies your lessons and items as text; <b>Import</b> brings them back. (This is different from the student’s 💾 Backup, which holds <i>his</i> progress.)</td></tr></table>'+
 '<h3>The Hall</h3><table><tr><th>Part</th><th>How it works</th></tr>'+
 '<tr><td>Projects</td><td>6 built-in projects, one per module (Modules 3–8, lessons 9–32), following each module’s project lesson, 99 Nights themed: all one site, <b>Night Camp</b> (a ranger school), that grows module by module, each about 20 tasks and showing that module’s ideas: <b>Night Camp</b> (inline styles), <b>style.css</b> (selectors), <b>Two pages</b> (borders, lists, margins), <b>Flexbox</b>, <b>Hover and position</b> (:hover, ::before, fixed/absolute), <b>Final site</b> (gradients, shadows, transforms, video). Edit them in <b>🏛 Hall</b>. Use <b>+ New project</b> to add your own and <b>hide</b> to keep one out of sight.</td></tr>'+
 '<tr><td>More than one page</td><td>Under <b>Code</b>, use <b>+ Page</b> to add pages like <code>about.html</code>. All pages share one style.css. He builds index.html first, then each page. The quest says which page it is for, and links between pages work in the preview. Lessons can have extra pages too (📚 Lessons → <b>+ Page</b>).</td></tr>'+
 '<tr><td>Removing a project</td><td>He can click <b>🗑 Remove</b> on a Hall card. You can also remove any of his Hall projects at the top of the <b>🏛 Hall</b> tab. His points and prizes stay. If he starts the same project again, those quests give no points a second time.</td></tr>'+
 '<tr><td>Builds on</td><td>A project can start from another project’s finished code; then only the new parts become quests. The built-in projects are chained this way (Module 4 builds on 3, 5 on 4, and so on). Keep a later project a superset of the earlier one. Each Hall card shows its quest and task count, so you can keep a project to about 20 tasks.</td></tr>'+
 '<tr><td>🎯 Practice</td><td>The project code is split into quests the normal way, up to <b>Max quests: Practice</b> (10).</td></tr>'+
 '<tr><td>✏️ Make it mine</td><td>Same steps, but any words, pictures, links and most CSS values count. Layout values (like <code>display: flex</code> or <code>position</code>) must still match. Extra “(more)” style quests are left out. The last quest is hard: add one thing that is not in the original. Up to <b>Max quests: Make it mine</b> (8) plus that last quest.</td></tr>'+
 '<tr><td>Progress</td><td>Hall work is saved with his progress and goes into his 💾 Backup. Points and prizes work like in lessons. Reports from Hall projects come to 📨 Reports as usual.</td></tr>'+
 '<tr><td>Changing a project</td><td>If you change a project’s code, his quests for it are rebuilt the next time he opens it from the Hall.</td></tr></table>'+
 '<h3>Good to know</h3><table><tr><th>Topic</th><th>Detail</th></tr>'+
 '<tr><td>Pictures</td><td>Only the built-in pictures show in the preview: axe, campfire, flashlight, bandage, carrot, tent, map, wolf, star (.png). star.png is small, so it works as a list bullet: <code>list-style: url("star.png")</code>. Other image files are still checked by name.</td></tr>'+
 '<tr><td>Video, sound, YouTube</td><td>They do not play in the preview, but the tags and attributes are checked.</td></tr>'+
 '<tr><td>Classes on text in Blocks mode</td><td>Use ⚙️ on the block, or the “any tag” block.</td></tr>'+
 '<tr><td>Switching Type → Blocks</td><td>Code comments and loose text straight inside the body are not kept as blocks; ↶ Undo brings back the old blocks.</td></tr></table>';
function renderGuide(){
  var tch=gTab==='teacher'&&!$('teacherView').hidden;
  $('guideView').innerHTML='<div class="tv"><div class="tvbar"><h2>'+(tch?'❓ Teacher guide':'❓ How to play Code Quest')+'</h2><button class="pbtn" id="guideClose">▶ Back</button></div>'+
   '<div class="gd">'+(tch?GUIDE_TEACHER:GUIDE_STUDENT)+'</div></div>';
}
$('guideBtn').onclick=function(){gTab='student';$('guideView').hidden=false;renderGuide();$('guideView').scrollTop=0;};
$('guideView').addEventListener('click',function(e){if(e.target.id==='guideClose')$('guideView').hidden=true;});
function openTeacherGuide(){gTab='teacher';$('guideView').hidden=false;renderGuide();$('guideView').scrollTop=0;}


