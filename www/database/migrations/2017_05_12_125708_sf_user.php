<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SfUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sf_user', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->default(0);
            $table->unsignedTinyInteger('fest_role')->default(0);
            $table->unsignedInteger('cur_fest_id')->default(0);
            $table->unsignedInteger('cur_proj_id')->default(0);
            $table->timestamps();
            $table->primary('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sf_user');
    }
}