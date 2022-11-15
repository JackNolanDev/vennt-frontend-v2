import { z } from "zod";
import apiInstanceOther from "./apiInstanceOther";

const randomNamesValidator = z.string().array();

export const fetchRandomNamesApi = async (): Promise<string[]> => {
  const number = Math.floor(Math.random() * 45) + 5;
  const url = `http://names.drycodes.com/${number}?nameOptions=boy_names,girl_names&separator=space`;
  const response = await apiInstanceOther.get("/get", { params: { url } });
  if (response.data.contents) {
    const ret = JSON.parse(response.data.contents);
    return randomNamesValidator.parse(ret);
  }
  throw new Error("invalid data");
};
