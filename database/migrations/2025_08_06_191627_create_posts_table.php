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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->longText('body')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('group_id')->nullable()->constrained('groups');
            $table->foreignId('repost_of_post_id')->nullable()->constrained('posts')->onDelete('cascade');
            $table->unsignedInteger('repost_count')->default(0);
            $table->timestamp('deleted_by')->nullable()->constrained('user');
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
