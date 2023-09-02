import { Form, ActionPanel, Action, Cache, popToRoot } from "@raycast/api";
import {useState} from "react";
import {FormItemTimezone, cacheKey} from "./infra/timezone";

export default function Command() {
    const cache = new Cache();
    const cacheValue = cache.get(cacheKey) || "0";

    const [datetime, setDatetime] = useState("");
    const [datetimeError, setDatetimeError] = useState<string | undefined>();
    const [timezone, setTimezone] = useState(cacheValue);
    const [timestamp, setTimestamp] = useState("0");

    function dropDatetimeErrorIfNeeded() {
        if (datetimeError && datetimeError.length > 0) {
            setDatetimeError(undefined);
        }
    }

    function calculate(text: string, timezone: string) {
        const s = parseDatetime(text);
        if (!s) {
            return
        }
        const year = s.year.toString().padStart(4, '0');
        const month = s.month.toString().padStart(2, '0');
        const day = s.day.toString().padStart(2, '0');
        const hour = s.hour.toString().padStart(2, '0');
        const minute = s.minute.toString().padStart(2, '0');
        const second = s.second.toString().padStart(2, '0');

        const offset = Number(timezone)
        const sign = offset < 0 ? '-' : '+';
        const tzHour = Math.trunc(offset/3600).toString().padStart(2, '0');
        const tzMinute = (Math.abs(((offset)/3600)%1)*60).toString().padStart(2, '0');

        const str = `${year}-${month}-${day}T${hour}:${minute}:${second}.000${sign}${tzHour}:${tzMinute}`;
        const date = new Date(str);
        const timestamp = Math.trunc(date.getTime()/1000);
        setTimestamp(timestamp.toString());
    }

    function handleDatetimeChange(text: string) {
        const s = parseDatetime(text);
        if (!s) {
            setDatetimeError(`${text} is illegal`);
            return
        }
        setDatetime(text);
        dropDatetimeErrorIfNeeded();
        calculate(text, timezone);
    }

    function handleTimezoneChange(timezone: string) {
        setTimezone(timezone);
        cache.set(cacheKey, timezone);
        calculate(datetime, timezone);
    }

    function handleCopy() {
        popToRoot();
    }

    function datetimeValid(datetime: string) {
        const s = parseDatetime(datetime);
        return s !== null;
    }

    function parseDatetime(datetime: string) {
        const exp : RegExp = /^\s*(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})\s*/;
        const res = datetime.match(exp);
        if (!res) {
            return null;
        }
        return {
            year: Number(res[1]),
            month: Number(res[2]),
            day: Number(res[3]),
            hour: Number(res[4]),
            minute: Number(res[5]),
            second: Number(res[6]),
        }
    }

    return (
        <Form
        actions={
            <ActionPanel>
                <Action.CopyToClipboard title='Copy to Clipboard' content={timestamp} onCopy={handleCopy} />
            </ActionPanel>
        }
        >
        <Form.TextField
            id="datetime"
            title="Datetime"
            placeholder="Enter datetime"
            error={datetimeError}
            onChange={handleDatetimeChange}
            onBlur={(event) => {
                if (!datetimeValid(event.target?.value || "")) {
                    setDatetimeError(`${event.target.value} is illegal`);
                } else {
                    dropDatetimeErrorIfNeeded();
                }
            }}
        />
        <FormItemTimezone id="timezone" title="Timezone" defaultValue={timezone} onChange={handleTimezoneChange} />
        <Form.Description title="Timestamp" text={timestamp} />
        </Form>
    )
}

