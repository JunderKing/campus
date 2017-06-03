<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class VmInvorScore extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vm_invor_score', function (Blueprint $table) {
          $table->increments('score_id');
          $table->unsignedInteger('invor_id')->default(0);
          $table->unsignedInteger('grader_id')->default(0);
          $table->unsignedTinyInteger('score')->default(0);
          $table->string('content', 500)->default('');
          $table->unique(['invor_id', 'grader_id']);
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
        Schema::dropIfExists('vm_invor_score');
    }
}
