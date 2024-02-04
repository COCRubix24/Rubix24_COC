import { StatusCodes } from "http-status-codes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import mime from "mime-types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

function fileToGenerativePart(path) {
  const mimeType = mime.lookup(path) || "application/octet-stream";
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

export const extraction = async (_, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const prompt = `Retrieve all the informations from above image , return it in json format with following details ,if detail is not present insert NULL value. The attributes needed are : "merchant_name", "merchant_address", "merchant_phone", "merchant_website", "merchant_tax_reg_no", "merchant_company_reg_no", "region", "mall", "country", "receipt_no", "date", "time", "items with their corresponding prices" (an array of objects), "amount", "category", "description", "flags", "qty", "remarks", "tags", "currency","total", "subtotal", "tax", "service_charge", "payment_method", "payment_details"`;

    const imageParts = [
      fileToGenerativePart("D:/zzzzzzz/Rubix24_COC/backend/assets/receipt.jpg"),
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    res.json({ generatedContent: text });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
