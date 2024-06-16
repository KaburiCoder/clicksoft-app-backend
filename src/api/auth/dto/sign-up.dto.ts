import { Exclude } from "class-transformer";
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


export type SignupDto = z.infer<typeof signupSchema>

export class SignupResponse {
  email: string;
  @Exclude()
  password: string;
}