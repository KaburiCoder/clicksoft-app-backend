import { Exclude } from "class-transformer";
import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


export type SigninDto = z.infer<typeof signinSchema>

export class SigninResponse {
  email: string;
  @Exclude()
  password: string;
}