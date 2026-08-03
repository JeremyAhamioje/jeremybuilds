/**
 * Tool stack, grouped by the job the tool does.
 *
 * Grouped rather than listed flat because a wall of twenty-eight logos says
 * "I have used many things"; five named groups say "I can take this end to
 * end", which is the actual claim.
 *
 * Group sizes are 5-6 by design. A three-logo group next to a six-logo group
 * makes the fan visibly lopsided as the carousel advances, so tools that sit
 * between two categories are placed where they even the run out.
 */

/**
 * Cloudinary delivers these, and every URL carries an `f_auto,q_auto`
 * transform. Widening that to include a pixel width is what stops a 1400px
 * logo JPEG being sent for a tile that renders at ~120px — the transform is
 * already there, it just was not being told how big the image needs to be.
 *
 * Returns the URL untouched if the marker is missing, so a hand-edited URL
 * degrades to "correct but heavy" rather than breaking.
 */
const MARKER = '/upload/f_auto,q_auto/'

export function sizedLogo(src, width) {
  // Tools with no usable logo carry `src: null` — tolerated here rather than
  // only at the call site, so adding another one cannot crash the section.
  if (!src || !src.includes(MARKER)) return src
  return src.replace(MARKER, `/upload/f_auto,q_auto,w_${width},c_limit/`)
}

/** Rendered at ~126px; 2x covers retina without paying for a third rung. */
export function logoSrcSet(src) {
  if (!src) return undefined
  return `${sizedLogo(src, 160)} 160w, ${sizedLogo(src, 320)} 320w`
}

/*
 * A note on the URLs below, because several are not what their filename says.
 *
 * Checked all 28 against what actually renders. Eight were serving a different
 * tool's logo than the name they were filed under. Four of those were a
 * straight permutation — the right image existed, under another tool's URL —
 * and have been repointed:
 *
 *   React       <- Git_on81gi.png            (holds the React mark)
 *   JavaScript  <- ReactJS_wlaisj.jpg        (holds the JS mark)
 *   HTML        <- node_p7mjdj.jpg           (holds the HTML5 mark)
 *   MongoDB     <- html_zulfdy.jpg           (holds the MongoDB mark)
 *
 * The remaining four have NO correct logo anywhere in the supplied set, so
 * they carry `src: null` and render as a wordmark. Showing the PostgreSQL
 * elephant under the word TYPESCRIPT is worse than showing no logo at all.
 *
 * Four images are now unused, and they are all real tools:
 *   PostgreSQL, Firebase, MySQL, Spline.
 * If those belong in the stack, give them their own entries — the likeliest
 * explanation is that these were always separate tools whose labels drifted.
 */

export const TOOL_GROUPS = [
  {
    id: 'frontend',
    label: 'Frontend',
    caption: 'Interfaces, and the frameworks that hold them together.',
    tools: [
      // Repointed: the React mark lives at the URL filed under "Git".
      { name: 'React', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662607/Git_on81gi.png', desc: 'Library for building composable UIs.' },
      { name: 'Next.js', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662952/Next_js_Logo_PNG_Vector_SVG_Free_Download_u7psxv.jpg', desc: 'React framework for production.' },
      // No TypeScript logo in the set — its URL serves the PostgreSQL mark.
      { name: 'TypeScript', src: null, desc: 'Typed superset of JavaScript.' },
      // Repointed: the JS mark lives at the URL filed under "React".
      { name: 'JavaScript', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662609/ReactJS_wlaisj.jpg', desc: 'The language of the web.' },
      // Repointed: the HTML5 mark lives at the URL filed under "Node.js".
      { name: 'HTML', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662608/node_p7mjdj.jpg', desc: 'Standard markup language.' },
      { name: 'Flutter', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1775013900/Flutter_vector_logo__EPS.SVG_ac7g95.jpg', desc: 'UI toolkit for compiled apps.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    caption: 'Data, APIs and the things that run when nobody is watching.',
    tools: [
      // No Node.js logo in the set — its URL serves the HTML5 mark.
      { name: 'Node.js', src: null, desc: 'JavaScript runtime on V8.' },
      // No Express logo in the set — its URL serves the MySQL mark.
      { name: 'Express', src: null, desc: 'Minimalist Node.js framework.' },
      // Repointed: the MongoDB mark lives at the URL filed under "HTML".
      { name: 'MongoDB', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662607/html_zulfdy.jpg', desc: 'NoSQL database for modern apps.' },
      { name: 'Supabase', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1775013907/Supabase_Logo_PNG_Vector_SVG_Free_Download_yozgux.jpg', desc: 'Open source Firebase alternative.' },
      { name: 'Python', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1775013900/Python_Programming_Language_Icon_PNG_SVG_Design_For_T-Shirts_xi7z0x.jpg', desc: 'High-level programming language.' },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    caption: 'Where the work is decided before a line of it is written.',
    tools: [
      { name: 'Figma', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662605/Figma__The_Collaborative_Interface_Design_Tool_pcpurs.jpg', desc: 'Collaborative interface design.' },
      { name: 'Blender', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662952/Blender_vector_logo_in_SVG_EPS_for_free_-_Brandlogos_net_k1og43.jpg', desc: '3D modeling, animation and rendering.' },
      { name: 'Webflow', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662605/The_Power_of_Webflow__What_a_Skilled_Developer_Can_Do_for_Your_Site_-_TechKnowable_k2xrw9.jpg', desc: 'Design-led web platform.' },
      { name: 'Material UI', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662607/Material_UI_vs_Joy_UI_vs_Base_UI_vehxtg.jpg', desc: 'React components on Material Design.' },
      { name: 'Canva', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662605/365________________________________________________365_inspirational_canvas_templates_for_business_dvfdtn.jpg', desc: 'Graphic design platform.' },
      { name: 'Pinterest', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662609/Pinterest_logo_sxige2.jpg', desc: 'Visual discovery for creative ideas.' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    caption: 'Shipping it, and keeping it up once it is out there.',
    tools: [
      { name: 'Docker', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662607/Docker_mark_logo_in_vector_formats_EPS_SVG_-_Brandlogos_net_xivv8v.jpg', desc: 'Containerized applications.' },
      { name: 'AWS', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662606/Best_Amazon_Web_Services_institute_gktrtv.jpg', desc: 'Comprehensive cloud platform.' },
      { name: 'Google Cloud', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662607/Google_Cloud_Logo_Icon_itt6fh.jpg', desc: 'Cloud computing by Google.' },
      { name: 'Vercel', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662605/Vercel_Logo_PNG_Vector_SVG_Free_Download_sxjjem.jpg', desc: 'Frontend deployment platform.' },
      // No Git logo in the set — its URL served the React mark, now used there.
      { name: 'Git', src: null, desc: 'Distributed version control.' },
    ],
  },
  {
    id: 'ai-workflow',
    label: 'AI & Workflow',
    caption: 'The bench the rest of it is built on.',
    tools: [
      { name: 'Claude', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662605/Download_Claude_AI_Logo_Rounded_HD_vxxlyd.jpg', desc: 'AI for reasoning and writing.' },
      { name: 'Gemini', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662606/gemini_logo_-_Pesquisa_Google_nnt3fe.jpg', desc: 'Advanced AI models from Google.' },
      { name: 'Copilot', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662607/Copilot_n79hzf.jpg', desc: 'AI-powered pair programmer.' },
      { name: 'VS Code', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662606/Visual_Studio_Code_logo_in_vector_format_-_Brandlogos_net_qpfjrw.jpg', desc: 'Code editor of choice.' },
      { name: 'Vite', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662952/Vite_Logo_PNG_Vector_SVG_Free_Download_tlvzdu.jpg', desc: 'Lightning-fast build tool and dev server.' },
      { name: 'Notion', src: 'https://res.cloudinary.com/dz6kxumoo/image/upload/f_auto,q_auto/v1772662609/Notion_Logo_transparent_PNG_-_StickPNG_vbmxmf.jpg', desc: 'All-in-one workspace.' },
    ],
  },
]

/** Seconds a group holds before the carousel advances. */
export const TOOLS_DWELL = 5

export const TOTAL_TOOLS = TOOL_GROUPS.reduce((sum, group) => sum + group.tools.length, 0)
