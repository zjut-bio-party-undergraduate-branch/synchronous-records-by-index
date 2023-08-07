import { BaseClient } from "@base-open/node-sdk";

export async function searchRecordsByIndex(client: BaseClient, index: string, value: string, tableId: string): Promise<{
  record_id?: string | undefined;
  created_by?: {
    id?: string | undefined;
    name?: string | undefined;
    en_name?: string | undefined;
    email?: string | undefined;
    avatar_url?: string | undefined;
  } | undefined;
  created_time?: number | undefined;
  last_modified_by?: {
    id?: string | undefined;
    name?: string | undefined;
    en_name?: string | undefined;
    email?: string | undefined;
    avatar_url?: string | undefined;
  } | undefined;
  last_modified_time?: number | undefined;
  fields: Record<string, string | number | number | number | boolean | {
    text?: string;
    link?: string;
  } | {
    location?: string;
    pname?: string;
    cityname?: string;
    adname?: string;
    address?: string;
    name?: string;
    full_address?: string;
  } | Array<string> | Array<{
    id?: string;
    name?: string;
    en_name?: string;
    email?: string;
    avatar_url?: string;
  }> | Array<{
    file_token?: string;
    name?: string;
    type?: string;
    size?: number;
    url?: string;
    tmp_url?: string;
  }>>;
}[] | undefined> {
  const records = (await client.base.appTableRecord.list({
    params: {
      filter: `CurrentValue.[${index}] = "${value}"`,
      field_names: `["${index}"]`,
      automatic_fields: true,
    },
    path: {
      table_id: tableId,
    }
  })).data?.items;
  return records;
}