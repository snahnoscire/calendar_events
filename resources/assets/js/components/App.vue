<template>
    <b-container fluid>
        <h3>Calendar</h3>
        <b-row>
            <b-col cols="3">
                <b-row role="group" class="mb-4">
                    <label for="input-live">Event</label>
                    <b-form-input
                        id="input-live"
                        v-model="textEvent"
                        placeholder="Enter event"
                        trim
                    ></b-form-input>
                </b-row>
                <b-row class="mb-4">
                    <b-col class="px-1">
                        <label for="date_start">From</label>
                        <b-datepicker
                            id="date_start"
                            v-model="dateStart"
                            size="sm"
                            locale="en-US"
                            placeholder="YYYY-MM-DD"
                            :today-button="true"
                            :reset-button="true"
                            :date-format-options="bDateFormat"
                            :date-disabled-fn="disabledDate(true, dateEnd)"
                        ></b-datepicker>
                    </b-col>
                    <b-col class="px-1">
                        <label for="date_end">To</label>
                        <b-datepicker
                            id="date_end"
                            v-model="dateEnd"
                            size="sm"
                            locale="en-US"
                            placeholder="YYYY-MM-DD"
                            :today-button="true"
                            :reset-button="true"
                            :date-format-options="bDateFormat"
                            :date-disabled-fn="disabledDate(false, dateStart)"
                        ></b-datepicker>
                    </b-col>

                </b-row>
                <b-row class="mb-4">
                    <b-form-checkbox-group
                        v-model="selectedDays"
                        :options="dayOptions"
                        value-field="item"
                        text-field="name"
                    ></b-form-checkbox-group>
                </b-row>
                <b-row>
                    <b-button variant="success" @click="save()">
                        <b-spinner v-if="isFetching" small class="mr-2"></b-spinner>
                        Save
                    </b-button>
                </b-row>
            </b-col>
            <b-col cols="9">
                <h2></h2>
                <b-dropdown size="lg" split :text="months[currentMonth]" class="m-2">
                    <b-dropdown-item-button @click="currentMonth = 1">January</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 2">February</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 3">March</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 4">April</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 5">May</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 6">June</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 7">July</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 8">August</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 9">September</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 10">October</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 11">November</b-dropdown-item-button>
                    <b-dropdown-item-button @click="currentMonth = 12">December</b-dropdown-item-button>
                </b-dropdown>
                <strong>2020</strong>
                <b-list-group>
                    <b-list-group-item v-for="date in daysThisMonth" :key="date.event_date">
                        <b-row class="p-2">
                            <b-col md="3">
                                {{ $moment(date.event_date).format('DD dddd') }}
                            </b-col>
                            <b-col md="9">
                                <b-card-text> {{ date.content }} </b-card-text>
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator';
import axios from 'axios'
const REQUEST_URI = '/api/events';
const DATE_FORMAT = 'YYYY-MM-DD';

@Component
export default class App extends Vue {
    isFetching = false;
    textEvent = '';
    dateStart = '';
    dateEnd = '';
    bDateFormat = { year: 'numeric', month: '2-digit', day: '2-digit' };
    selectedDays = [];
    dayOptions = [
        {
            item: 'monday',
            name: 'Mon'
        },
        {
            item: 'tuesday',
            name: 'Tue'
        },
        {
            item: 'wednesday',
            name: 'Wed'
        },
        {
            item: 'thursday',
            name: 'Thur'
        },
        {
            item: 'friday',
            name: 'Fri'
        },
        {
            item: 'saturday',
            name: 'Saturday'
        },
        {
            item: 'sunday',
            name: 'Sun'
        }
    ];
    dateList = [];
    daysThisMonth = [];

    initialData = [];

    months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    }

    currentMonth = 0;

    async created(){
        await this.requestGetData();
        this.currentMonth = this.$moment().month() + 1;
    }

    async save() {
        try{
            this.isFetching = true;
            this.parseFilterData();
            let {data} = await axios.post(REQUEST_URI, {
                event: this.dateList
            })
            await this.requestGetData();
            this.getDaysByMonth();
            this.isFetching = false;
            this.showToast(data);
        } catch (e) {
            alert(e);
        }
    }

    showToast(isSuccess){
        this.$bvToast.toast(isSuccess?'Successfully saved' : 'Nothing to save', {
            title: 'Calendar Event Request',
            'append-toast': false,
            'no-close-button': true,
            'is-status': true,
            'auto-hide-delay': 3000,
            solid: false,
            variant: isSuccess ? 'success' : 'warning',
        })
    }

    parseFilterData(){
        let start = this.$moment(this.dateStart);
        let end = this.$moment(this.dateEnd);
        if (!(start.isValid() && end.isValid())) return;
        this.dateList = [];
        while (this.$moment.max(start, end) === end) {
            this.checkDayInCheckList(start) && this.dateList.push({
                event_date: start.format(DATE_FORMAT),
                content: this.textEvent,
            });
            start = start.add(1, 'day');
        }
        this.checkDayInCheckList(start) && this.dateList.push({
            event_date: end.format(DATE_FORMAT),
            content: this.textEvent,
        });
    }

    async requestGetData(){
        try {
            let {data} = await axios.get('/api/events');
            this.initialData = [];
            this.initialData = _.chain(data)
                .mapKeys(data => data.event_date)
                .mapValues((data) => data.content)
                .value();
        } catch (e) {
            alert(e);
        }
    }

    checkDayInCheckList(date) {
        return Object.values(this.selectedDays).includes(date.format('dddd').toLowerCase());
    }

    @Watch('currentMonth')
    getDaysByMonth() {
        this.daysThisMonth = [];
        let momentMonth = this.$moment(this.dateMonthFormatted, 'YYYY-MM');
        let daysInMonth = momentMonth.daysInMonth();
        let existingEventKeys = Object.keys(this.initialData);
        let current = 1;

        while(current <= daysInMonth) {
            let eDate = momentMonth.date(current).format(DATE_FORMAT);
            let content = existingEventKeys.includes(eDate) ? this.initialData[eDate] : '';
            this.daysThisMonth.push({
                event_date: eDate,
                content: content
            });
            current++;
        }
    }

    get dateMonthFormatted(){
        let MM = this.currentMonth > 9 ? this.currentMonth.toString() : `0${this.currentMonth}`;
        return `${this.$moment().format('YYYY')}-${MM}`;
    }

    disabledDate(isStartDate, otherDate){
        return (sDateFormatted, oDate) => (
            this.$moment(otherDate).isValid() && (
                isStartDate
                    ? this.$moment(sDateFormatted).isAfter(otherDate)
                    : this.$moment(otherDate).isAfter(sDateFormatted)
            )
        );
    }
}
</script>