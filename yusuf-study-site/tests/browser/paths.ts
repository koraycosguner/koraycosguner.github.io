/** Run the same learning regression suite at the original root or a hosted subpath. */
export const studyPath=(path:string)=>(process.env.TEST_PATH_PREFIX??'')+path;
