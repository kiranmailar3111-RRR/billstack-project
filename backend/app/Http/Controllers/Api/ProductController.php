<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku',
            'purchase_price' => 'nullable|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'gst_percent' => 'nullable|integer|min:0',
            'stock' => 'nullable|integer|min:0',
            'min_stock_alert' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'nullable|string',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'sku' => $request->sku,
            'purchase_price' => $request->purchase_price ?? 0,
            'selling_price' => $request->selling_price,
            'gst_percent' => $request->gst_percent ?? 0,
            'stock' => $request->stock ?? 0,
            'min_stock_alert' => $request->min_stock_alert ?? 10,
            'image' => $imagePath,
            'status' => $request->status ?? 'Active',
        ]);

        StockLog::create([
            'product_id' => $product->id,
            'type' => 'Purchase',
            'quantity' => $product->stock,
            'old_stock' => 0,
            'new_stock' => $product->stock,
            'notes' => 'Initial product stock',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully',
            'data' => $product->load('category'),
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'status' => true,
            'data' => $product->load('category'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku,' . $product->id,
            'purchase_price' => 'nullable|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'gst_percent' => 'nullable|integer|min:0',
            'stock' => 'nullable|integer|min:0',
            'min_stock_alert' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'nullable|string',
        ]);

        $oldStock = $product->stock;

        $imagePath = $product->image;

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $imagePath = $request->file('image')->store('products', 'public');
        }

        $newStock = $request->stock ?? $product->stock;

        $product->update([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'sku' => $request->sku,
            'purchase_price' => $request->purchase_price ?? 0,
            'selling_price' => $request->selling_price,
            'gst_percent' => $request->gst_percent ?? 0,
            'stock' => $newStock,
            'min_stock_alert' => $request->min_stock_alert ?? 10,
            'image' => $imagePath,
            'status' => $newStock < ($request->min_stock_alert ?? 10) ? 'Low Stock' : 'Active',
        ]);

        if ($oldStock != $newStock) {
            StockLog::create([
                'product_id' => $product->id,
                'type' => 'Adjustment',
                'quantity' => abs($newStock - $oldStock),
                'old_stock' => $oldStock,
                'new_stock' => $newStock,
                'notes' => 'Product stock updated manually',
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'data' => $product->load('category'),
        ]);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}