import { Form } from "@raycast/api";

class Timezone {
    readonly title: string;
    readonly offset: number;
    constructor(title: string, offset: number) {
        this.title = title;
        this.offset = offset;
    }
}

const timezones = [
    new Timezone("UTC+14", 14*60*60),
    new Timezone("UTC+13", 13*60*60),
    new Timezone("UTC+12:45", 12.75*60*60),
    new Timezone("UTC+12", 12*60*60),
    new Timezone("UTC+11", 11*60*60),
    new Timezone("UTC+10:30", 10.5*60*60),
    new Timezone("UTC+10", 10*60*60),
    new Timezone("UTC+9:30", 9.5*60*60),
    new Timezone("UTC+9", 9*60*60),
    new Timezone("UTC+8", 8*60*60),
    new Timezone("UTC+7", 7*60*60),
    new Timezone("UTC+6:30", 6.5*60*60),
    new Timezone("UTC+6", 6*60*60),
    new Timezone("UTC+5:45", 5.75*60*60),
    new Timezone("UTC+5:30", 5.5*60*60),
    new Timezone("UTC+5", 5*60*60),
    new Timezone("UTC+4:30", 4.5*60*60),
    new Timezone("UTC+4", 4*60*60),
    new Timezone("UTC+3:30", 3.5*60*60),
    new Timezone("UTC+3", 3*60*60),
    new Timezone("UTC+2", 2*60*60),
    new Timezone("UTC+1", 1*60*60),
    new Timezone("UTC+0", 0*60*60),
    new Timezone("UTC-1", -1*60*60),
    new Timezone("UTC-2", -2*60*60),
    new Timezone("UTC-3", -3*60*60),
    new Timezone("UTC-3:30", -3.5*60*60),
    new Timezone("UTC-4", -4*60*60),
    new Timezone("UTC-5", -5*60*60),
    new Timezone("UTC-6", -6*60*60),
    new Timezone("UTC-7", -7*60*60),
    new Timezone("UTC-8", -8*60*60),
    new Timezone("UTC-9", -9*60*60),
    new Timezone("UTC-9:30", -9.5*60*60),
    new Timezone("UTC-10", -10*60*60),
    new Timezone("UTC-11", -11*60*60),
    new Timezone("UTC-12", -12*60*60),
];

export const cacheKey = "timezone";

export function FormItemTimezone(props) {
    function handleTimezoneChange(timezone: string) {
        if (props.onChange) {
            props.onChange(timezone);
        }
    }

    return (
        <Form.Dropdown id={props.id} title={props.title} onChange={handleTimezoneChange} defaultValue={props.defaultValue || "0"}>
        {timezones.map(timezone => {
            return <Form.Dropdown.Item key={timezone.title} title={timezone.title} value={timezone.offset.toString()} />
        })}
        </Form.Dropdown>
    )
}
