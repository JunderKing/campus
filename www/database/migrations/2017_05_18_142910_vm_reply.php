<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class VmReply extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vm_reply', function (Blueprint $table) {
            $table->increments('reply_id');
            $table->unsignedInteger('replier_id')->default(0);
            $table->unsignedTinyInteger('tar_type')->default(0);
            $table->unsignedInteger('tar_id')->default(0);
            $table->string('content', 500)->default(0);
            $table->index(['tar_type', 'tar_id']);
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
        Schema::dropIfExists('vm_reply');
    }
}
