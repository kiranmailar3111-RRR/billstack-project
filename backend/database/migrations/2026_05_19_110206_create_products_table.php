<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->string('name');
    $table->string('sku')->unique();
    $table->decimal('purchase_price', 10, 2)->default(0);
    $table->decimal('selling_price', 10, 2)->default(0);
    $table->integer('gst_percent')->default(0);
    $table->integer('stock')->default(0);
    $table->integer('min_stock_alert')->default(10);
    $table->string('image')->nullable();
    $table->string('status')->default('Active');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
