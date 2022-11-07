import createInstance from "./instance";
import rewriteUrl from "./middleware/rewrite-url";
import handleError from "./middleware/handle-error";

const axios = createInstance();
axios.interceptors.request.use(rewriteUrl, handleError);

export default axios;
