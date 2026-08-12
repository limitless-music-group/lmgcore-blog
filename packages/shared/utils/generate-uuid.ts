// packages/shared/utils/generate-uuid.ts
import { v7 as uuidV7 } from "uuid";

export function generateUUID(): string {
  return uuidV7();
}

/** Generates an unique internal ID for each artist
 *
 * Prefixed `GNV-ART` for easier readability
 *
 * @example
 * GNV-ART-0197c7b7-7d5b-7d6d-a6a0-8d7b8dfe7b71
 */
export function generateGenivivArtistUUID(): string {
  return `GNV-ART-${uuidV7()}`;
}
/** Generates an unique internal ID for each label
 *
 * Prefixed `GNV-LAB` for easier readability
 *
 * @example
 * GNV-LAB-0197c7b7-7d5b-7d6d-a6a0-8d7b8dfe7b71
 */
export function generateGenivivLabelUUID(): string {
  return `GNV-LAB-${uuidV7()}`;
}

/** Generates a unique transfer code for each label */
export function generateGenivivLabelTransferCode(): string {
  return `GNV-LAB-TRANS-${uuidV7()}`;
}
/** Generates an unique internal ID for each playlist
 *
 * Prefixed `GNV-PLA` for easier readability
 *
 * @example
 * GNV-PLA-0197c7b7-7d5b-7d6d-a6a0-8d7b8dfe7b71
 */
export function generateGenivivPlaylistUUID(): string {
  return `GNV-PLA-${uuidV7()}`;
}
/** Generates an unique internal ID for each file
 *
 * Prefixed `GNV-FIL` for easier readability
 *
 * @example
 * GNV-FIL-0197c7b7-7d5b-7d6d-a6a0-8d7b8dfe7b71
 */
export function generateGenivivFileUUID(): string {
  return `GNV-FIL-${uuidV7()}`;
}
