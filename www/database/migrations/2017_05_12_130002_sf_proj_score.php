<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SfProjScore extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sf_proj_score', function (Blueprint $table) {
          $table->increments('score_id');
          $table->unsignedInteger('proj_id')->default(0);
          $table->unsignedInteger('grader_id')->default(0);
          $table->unsignedTinyInteger('t_score')->default(0);
          $table->unsignedTinyInteger('a_score')->default(0);
          $table->unsignedTinyInteger('b_score')->default(0);
          $table->unsignedTinyInteger('c_score')->default(0);
          $table->string('content', 500)->default('');
          $table->unique(['grader_id', 'proj_id']);
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
        Schema::dropIfExists('sf_proj_score');
    }
}
