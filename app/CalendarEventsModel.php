<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CalendarEventsModel extends Model
{
    protected $table = 'events';
    protected $dateFormat = 'Y-m-d';
    protected $fillable = ['content', 'event_date'];
}
