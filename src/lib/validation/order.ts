import { z } from "zod";

import { fulfillmentTypeValues, menuItemTypeValues } from "@/lib/order-types";

const optionalText = z
  .string()
  .max(300, "Must be 300 characters or less")
  .optional()
  .transform((value) => value?.trim() ?? "");

export const orderItemInputSchema = z.object({
  menuItemId: z.string().min(1),
  qty: z.number().int().min(1).max(50),
  specialInstructions: optionalText,
});

const checkoutBaseSchema = z.object({
  customerName: z.string().min(2, "Enter your name").max(100),
  customerEmail: z.string().email("Enter a valid email"),
  customerPhone: z.string().min(7, "Enter a valid phone number").max(20),
  fulfillmentType: z.enum(fulfillmentTypeValues),
  tipCents: z.number().int().min(0).max(20_000),
  distanceMiles: z.number().min(0).max(5).optional(),
  deliveryAddressLine1: z.string().max(120).optional(),
  deliveryAddressLine2: z.string().max(120).optional(),
  deliveryCity: z.string().max(80).optional(),
  deliveryState: z.string().max(80).optional(),
  deliveryZip: z.string().max(20).optional(),
  deliveryNotes: z.string().max(300).optional(),
});

function validateDeliveryFields(
  value: {
    fulfillmentType: (typeof fulfillmentTypeValues)[number];
    deliveryAddressLine1?: string;
    deliveryCity?: string;
    deliveryState?: string;
    deliveryZip?: string;
  },
  ctx: z.RefinementCtx,
) {
  if (value.fulfillmentType !== "DELIVERY") {
    return;
  }

  if (!value.deliveryAddressLine1?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Address line 1 is required for delivery",
      path: ["deliveryAddressLine1"],
    });
  }
  if (!value.deliveryCity?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "City is required for delivery",
      path: ["deliveryCity"],
    });
  }
  if (!value.deliveryState?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "State is required for delivery",
      path: ["deliveryState"],
    });
  }
  if (!value.deliveryZip?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ZIP is required for delivery",
      path: ["deliveryZip"],
    });
  }
}

export const checkoutFormSchema = checkoutBaseSchema.superRefine(validateDeliveryFields);

export const createOrderRequestSchema = checkoutBaseSchema
  .extend({
    items: z.array(orderItemInputSchema).min(1, "Cart is empty"),
  })
  .superRefine(validateDeliveryFields);

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  basePriceCents: z.number().int().nonnegative(),
  imageUrl: z.string().nullable(),
  isPopular: z.boolean(),
  isFeatured: z.boolean(),
  type: z.enum(menuItemTypeValues),
});

export type MenuItemDto = z.infer<typeof menuItemSchema>;
