<?php

namespace App\Http\Controllers;

use App\CalendarEventsModel;
use Illuminate\Http\Request;

class CalendarEventsController extends Controller
{
    /**
     * @param Request $request
     * @return array
     */
    public function index(Request $request): array
    {
        $events = new CalendarEventsModel();
        return $events::all()->toArray();
    }

    /**
     * @param Request             $request
     * @param CalendarEventsModel $calendarEventsModel
     * @return mixed
     */
    public function store(Request $request, CalendarEventsModel $calendarEventsModel)
    {
        $event = $request->get('event');
        if (!(is_array($event) && count($event) > 0)) return false;
        foreach ($event as $data){
            $calendarEventsModel::updateOrCreate(
                ['event_date' => $data['event_date']],
                ['content' => $data['content']]
            );
        }
        return true;
    }
}
