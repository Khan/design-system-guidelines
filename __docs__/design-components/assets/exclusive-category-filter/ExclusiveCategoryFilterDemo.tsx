import * as React from "react";
import {ExclusiveCategoryFilter} from "@khanacademy/wonder-blocks-filters";
import {BodyText} from "@khanacademy/wonder-blocks-typography";

const activities = [
    {name: "Fractions on a number line", subject: "math"},
    {name: "Equivalent fractions", subject: "math"},
    {name: "Photosynthesis", subject: "science"},
    {name: "States of matter", subject: "science"},
    {name: "Main idea and details", subject: "reading"},
];

const options = [
    {value: "all", label: "All"},
    {value: "math", label: "Math"},
    {value: "science", label: "Science"},
    {value: "reading", label: "Reading"},
];

// Hides the label visually but keeps it as the group's accessible name.
const visuallyHidden = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
} as const;

/**
 * Live, stateful exclusive category filter for its guideline page. The
 * results render directly after the filter so `Tab` leads to them.
 */
export function ExclusiveCategoryFilterDemo() {
    const [subject, setSubject] = React.useState("all");
    const visible =
        subject === "all"
            ? activities
            : activities.filter((a) => a.subject === subject);
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "16px", width: "100%"}}>
            <ExclusiveCategoryFilter
                label="Filter by subject"
                options={options}
                selectedValue={subject}
                onChange={setSubject}
                styles={{label: visuallyHidden}}
            />
            <ul style={{margin: 0, paddingInlineStart: "20px"}}>
                {visible.map((a) => (
                    <li key={a.name}>
                        <BodyText tag="span">{a.name}</BodyText>
                    </li>
                ))}
            </ul>
        </div>
    );
}
