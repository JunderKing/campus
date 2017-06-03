<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SfComnt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sf_comnt', function (Blueprint $table) {
            $table->increments('comnt_id');
            $table->unsignedInteger('proj_id')->default(0);
            $table->unsignedInteger('comntor_id')->default(0);
            $table->string('content', 500)->default(0);
            $table->index('proj_id');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sf_comnt');
    }
}
