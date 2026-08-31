import type { Container } from "../../containers/container.js";
/**
 * Rebuild container for `container.idx` created on first use.
 */
declare function getOrCreateRerunContainer(containers_: Container[], container: Container): Container;
export { getOrCreateRerunContainer };
