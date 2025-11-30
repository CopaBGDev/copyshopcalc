"use server";

import type { OrderItem } from "@/lib/types";

export async function createOrder(items: OrderItem[], total: number) {
  // In a real app, you would validate the data and save it to a database like Firestore.
  // For this example, we'll just log it to the console to simulate the action.
  
  if (!items || items.length === 0 || total <= 0) {
    return { success: false, message: "Korpa je prazna." };
  }

  try {
    console.log("--- KREIRANJE NOVE PORUDŽBINE ---");
    console.log("Vreme:", new Date().toISOString());
    console.log("Ukupno:", total.toFixed(2), "RSD");
    console.log("Stavke:", JSON.stringify(items, null, 2));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log("--- PORUDŽBINA USPEŠNO KREIRANA ---");
    
    return { success: true, message: "Porudžbina je uspešno kreirana." };
  } catch (error) {
    console.error("Greška pri kreiranju porudžbine:", error);
    return { success: false, message: "Došlo je do greške prilikom kreiranja porudžbine." };
  }
}
