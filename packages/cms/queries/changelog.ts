import { defineQuery } from "groq";

// All releases, newest first, for changelog timeline rendering.
export const CHANGELOGS_QUERY = defineQuery(`*[
  _type == "release"
]|order(date desc){
  _id,
  version,
  date,
  summary,
  groups[]{ type, items }
}`);

// Single release by version.
export const CHANGELOG_QUERY = defineQuery(`*[
  _type == "release"
  && version == $version
][0]{
  _id,
  version,
  date,
  summary,
  groups[]{ type, items }
}`);
