import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const REPORTS_TABLE = "deadlink_scan_reports";
const RESULTS_TABLE = "deadlink_scan_results";

export async function putReport(item: Record<string, unknown>) {
  await docClient.send(
    new PutCommand({ TableName: REPORTS_TABLE, Item: item })
  );
}

export async function getReportById(reportId: string) {
  // Uses GSI on report_id
  const res = await docClient.send(
    new QueryCommand({
      TableName: REPORTS_TABLE,
      IndexName: "report_id-index",
      KeyConditionExpression: "report_id = :rid",
      ExpressionAttributeValues: { ":rid": reportId },
      Limit: 1,
    })
  );
  return res.Items?.[0] ?? null;
}

export async function getReportsBySiteId(siteId: string) {
  const res = await docClient.send(
    new QueryCommand({
      TableName: REPORTS_TABLE,
      KeyConditionExpression: "site_id = :sid",
      ExpressionAttributeValues: { ":sid": siteId },
      ScanIndexForward: false,
      Limit: 10,
    })
  );
  return res.Items ?? [];
}

export async function putResult(item: Record<string, unknown>) {
  await docClient.send(
    new PutCommand({ TableName: RESULTS_TABLE, Item: item })
  );
}

export async function getResultsByReportId(reportId: string) {
  const res = await docClient.send(
    new QueryCommand({
      TableName: RESULTS_TABLE,
      KeyConditionExpression: "report_id = :rid",
      ExpressionAttributeValues: { ":rid": reportId },
    })
  );
  return res.Items ?? [];
}
