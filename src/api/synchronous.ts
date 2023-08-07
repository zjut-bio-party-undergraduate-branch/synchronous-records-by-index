import { BaseClient } from '@base-open/node-sdk';
import { APIConfig } from '@/types';
import { searchRecordsByIndex } from '@/utils';

export interface synchronousConfig extends APIConfig {
  from: string; // "tableId"
  to: string; // "tableId"
  recordId: string;
  indexName: string;
  indexValue: string;
}

export async function synchronous(client: BaseClient, config: synchronousConfig) {
  const { from, to, recordId, indexName, indexValue } = config;
  const fromRecords = await searchRecordsByIndex(client, indexName, indexValue, from);
  console.log(fromRecords)
  if (!fromRecords) return
  fromRecords.sort((a, b) => b?.last_modified_time as number - a?.last_modified_time as number);
  const newRecord = fromRecords.shift();
  if (!newRecord) return;
  if (fromRecords.length === 0) {
    console.log(`There is no same record in the ${from}, so prepare to create a new record in the ${to}.`, JSON.stringify(fromRecords[0]));
  } else {
    const deleteRes = await client.base.appTableRecord.batchDelete({
      path: {
        table_id: from,
      },
      data: {
        records: fromRecords.map(record => record.record_id as string),
      }
    })
    console.log(deleteRes)
  }
  const targetRecords = await searchRecordsByIndex(client, indexName, indexValue, to);
  if (!targetRecords || targetRecords?.length === 0) {
    console.log(`There is no same record in the ${to}, so create a new record in the ${to}.`);
    const res = await client.base.appTableRecord.create({
      path: {
        table_id: to,
      },
      data: { fields: newRecord.fields}
    });
    console.log(res);
  } else {
    console.log(`There is a same record in the ${to}`, JSON.stringify(targetRecords));
  }
}