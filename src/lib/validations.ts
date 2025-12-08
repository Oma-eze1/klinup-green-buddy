import { z } from "zod";

// Auth validations
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
});

export const signupSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
  confirmPassword: z.string(),
  fullName: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
  // Role-specific optional fields
  companyName: z.string().max(200).optional(),
  organizationName: z.string().max(200).optional(),
  businessName: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  materialType: z.string().max(100).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Waste report validations
export const wasteReportSchema = z.object({
  description: z.string().max(1000, "Description too long").optional(),
});

// Cash out validations
export const cashOutSchema = z.object({
  category: z.enum(["plastic", "metal", "glass", "e-waste", "paper", "others"], {
    required_error: "Please select a category",
  }),
  weight: z.number().min(0.1, "Weight must be at least 0.1 kg").max(10000, "Weight too large"),
});

// Gift out validations
export const giftOutSchema = z.object({
  title: z.string().trim().min(1, "Item name is required").max(200, "Item name too long"),
  category: z.enum(["clothes", "electronics", "furniture", "books", "toys", "others"], {
    required_error: "Please select a category",
  }),
  condition: z.enum(["new", "fairly_used", "needs_repair"], {
    required_error: "Please select condition",
  }),
  description: z.string().max(1000, "Description too long").optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type WasteReportInput = z.infer<typeof wasteReportSchema>;
export type CashOutInput = z.infer<typeof cashOutSchema>;
export type GiftOutInput = z.infer<typeof giftOutSchema>;
