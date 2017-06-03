<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class VmProjMember extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vm_proj_member', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->default(0);
            $table->unsignedInteger('proj_id')->default(0);
            $table->unsignedTinyInteger('is_leader')->default(0);
            $table->primary(['user_id', 'proj_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vm_proj_member');
    }
}
