export const meta_extractor = (
  url: string
): {
  file_name: string;
  project_id: string;
  embedded: boolean;
  compilation_scope: "app" | "component";
} => {
  const url_obj = new URL(url, "http://localhost"); // sample url index.html?project_id=123&embedded=true&compilation_type=component
  const project_id = url_obj.searchParams.get("project_id") || "default_project_id";
  const embedded = url_obj.searchParams.get("embedded") === "true";
  const compilation_scope =
    (url_obj.searchParams.get("compilation_scope") as "app" | "component") || "app";

  const file_name = url_obj.pathname.split("/").pop() || "index.html";

  return {
    file_name,
    project_id,
    embedded,
    compilation_scope,
  };
};
