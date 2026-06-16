"use client";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Products from "@/views/Products";

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <Suspense>
        <Products />
      </Suspense>
    </>
  );
}
