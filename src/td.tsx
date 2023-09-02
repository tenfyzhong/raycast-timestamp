import { Form, ActionPanel, Action, Cache, popToRoot } from "@raycast/api";
import {useState} from "react";
import {FormItemTimezone, cacheKey} from "./infra/timezone";

export default function Command() {
    const cache = new Cache();
    const cacheValue = cache.get(cacheKey) || "0";

    const [text, setText] = useState("1970-01-01 00:00:00");
    const [timestampError, setTimestampError] = useState<string | undefined>();
    const [timezone, setTimezone] = useState(cacheValue);
    const [timestamp, setTimestamp] = useState("");

    function dropTimestampErrorIfNeeded() {
        if (timestampError && timestampError.length > 0) {
            setTimestampError(undefined);
        }
    }

    function formatDate(date: Date, offset: number) {
        const localDate = new Date(date.getTime() + offset * 1000);
        const str = localDate.toISOString();
        const dateStr = str.slice(0, 10);
        const timeStr = str.slice(11, 19);
        return `${dateStr} ${timeStr}`
    }

    function calculate(text: string, timezone: string) {
        const timestamp = Number(text.trim()) * 1000;
        const date = new Date(timestamp);
        const offset = Number(timezone);
        const str = formatDate(date, offset);
        setText(str);
    }

    function handleTimestampChange(text: string) {
        if (!timestampValid(text)) {
            setTimestampError(`${text} must be a number`);
            return
        }
        setTimestamp(text);
        dropTimestampErrorIfNeeded();
        calculate(text, timezone);
    }

    function handleTimezoneChange(timezone: string) {
        setTimezone(timezone);
        cache.set(cacheKey, timezone);
        calculate(timestamp, timezone);
    }

    function handleCopy() {
        popToRoot();
    }

    function timestampValid(text: string) {
        const exp : RegExp = /^\s*\d*\s*$/;
        const res = text.match(exp);
        return res !== null;
    }

    return (
        <Form
        actions={
            <ActionPanel>
                <Action.CopyToClipboard title='Copy to Clipboard' content={text} onCopy={handleCopy} />
            </ActionPanel>
        }
        >
        <Form.TextField
            id="timestamp"
            title="Timestamp"
            placeholder="Enter timestamp"
            error={timestampError}
            onChange={handleTimestampChange}
            onBlur={(event) => {
                if (!timestampValid(event.target?.value || "")) {
                    setTimestampError(`${event.target.value} must be a number`);
                } else {
                    dropTimestampErrorIfNeeded();
                }
            }}
        />
        <FormItemTimezone id="timezone" title="Timezone" defaultValue={timezone} onChange={handleTimezoneChange} />
        <Form.Description title="Datetime" text={text} />
        </Form>
        );
}
