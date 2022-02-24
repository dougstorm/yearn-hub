/* eslint-disable react/jsx-key */
/* eslint-disable react/display-name */
import { GenericList, GenericListItem } from '../../app';
import { CellPosition, HeadCell } from '../../app/GenericList/HeadCell';
import { colors, getSemaphoreInfo } from '../Semaphore';

const splitString = (
    item: string,
    separator: string,
    defaultList: string[]
) => {
    return item === '' ? defaultList : item.split(separator);
};

type GroupQueryLinkProps = {
    keyValue: string;
    groups: string;
    groupLabel: string;
    groupId: string;
    grouping: string;
    urlParam: string;
};
const GroupQueryLink = (props: GroupQueryLinkProps) => {
    const { groupLabel, groupId, keyValue } = props;
    if (groupId === '-') {
        return <li key={keyValue}>{groupId}</li>;
    }
    return <li key={keyValue}>{groupLabel}</li>;
};

export const headCells: HeadCell<GenericListItem>[] = [
    {
        id: 'label',
        numeric: true,
        disablePadding: false,
        label: 'Impact',
        align: 'center',
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Rare (1)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groupLabels = splitString(item.rareLabels.toString(), ',', [
                '-',
            ]);
            const groupIds = splitString(item.rareIds.toString(), ',', ['-']);
            return (
                <ol>
                    {groupLabels.map((group, index) => (
                        <GroupQueryLink
                            keyValue={`rare-${groupIds[index]}-${position.columnNumber}-${position.rowNumber}`}
                            groupLabel={group}
                            groups={item.groups.toString()}
                            groupId={groupIds[index]}
                            grouping={item.grouping.toString()}
                            urlParam={`${item.urlParam}`}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                color: 'black',
                backgroundColor: colors[4][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Unlikely (2)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groupLabels = splitString(
                item.unlikelyLabels.toString(),
                ',',
                ['-']
            );
            const groupIds = splitString(item.unlikelyIds.toString(), ',', [
                '-',
            ]);
            return (
                <ol>
                    {groupLabels.map((groupLabel, index) => (
                        <GroupQueryLink
                            keyValue={`unlikely-${groupIds[index]}-${position.columnNumber}-${position.rowNumber}`}
                            groupLabel={groupLabel}
                            groups={item.groups.toString()}
                            groupId={groupIds[index]}
                            grouping={item.grouping.toString()}
                            urlParam={`${item.urlParam}`}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                color: 'black',
                backgroundColor: colors[3][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Even Chance (3)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groupLabels = splitString(
                item.evenChanceLabels.toString(),
                ',',
                ['-']
            );
            const groupIds = splitString(item.evenChanceIds.toString(), ',', [
                '-',
            ]);
            return (
                <ol>
                    {groupLabels.map((group, index) => (
                        <GroupQueryLink
                            keyValue={`even-chance-${groupIds[index]}-${position.columnNumber}-${position.rowNumber}`}
                            groupLabel={group}
                            groups={item.groups.toString()}
                            groupId={groupIds[index]}
                            grouping={item.grouping.toString()}
                            urlParam={`${item.urlParam}`}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                color: 'black',
                backgroundColor: colors[2][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Likely (4)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groupLabels = splitString(item.likelyLabels.toString(), ',', [
                '-',
            ]);
            const groupIds = splitString(item.likelyIds.toString(), ',', ['-']);
            return (
                <ol>
                    {groupLabels.map((groupLabel, index) => (
                        <GroupQueryLink
                            keyValue={`likely-${groupIds[index]}-${position.columnNumber}-${position.rowNumber}`}
                            groupLabel={groupLabel}
                            groups={item.groups.toString()}
                            groupId={groupIds[index]}
                            grouping={item.grouping.toString()}
                            urlParam={`${item.urlParam}`}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                color: 'black',
                backgroundColor: colors[1][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Almost Certain (5)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groupLabels = splitString(
                item.almostCertainLabels.toString(),
                ',',
                ['-']
            );
            const groupIds = splitString(
                item.almostCertainIds.toString(),
                ',',
                ['-']
            );
            return (
                <ol>
                    {groupLabels.map((groupLabel, index) => (
                        <GroupQueryLink
                            keyValue={`almost-certain-${groupIds[index]}-${position.columnNumber}-${position.rowNumber}`}
                            groupLabel={groupLabel}
                            groups={item.groups.toString()}
                            groupId={groupIds[index]}
                            grouping={item.grouping.toString()}
                            urlParam={`${item.urlParam}`}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                color: 'black',
                backgroundColor: colors[0][5 - position.rowNumber],
            };
        },
    },
];
type RiskChartProps = {
    items: Array<{
        id: string;
        groups: string;
        label: string;
        impact: number;
        likelihood: number;
        urlParam: string;
    }>;
};

type RiskItem = {
    label: string;
    grouping: string;
    urlParam: string;
    groups: string;

    rareLabels: string;
    rareIds: string;
    rareImpact: number;
    rareLikelihood: number;

    unlikelyIds: string;
    unlikelyLabels: string;
    unlikelyImpact: number;
    unlikelyLikelihood: number;

    evenChanceIds: string;
    evenChanceLabels: string;
    evenChanceImpact: number;
    evenChanceLikelihood: number;

    likelyIds: string;
    likelyLabels: string;
    likelyImpact: number;
    likelyLikelihood: number;

    almostCertainIds: string;
    almostCertainLabels: string;
    almostCertainImpact: number;
    almostCertainLikelihood: number;
};

const createRiskItem = (label: string, impact: number): RiskItem => {
    return {
        label,
        grouping: 'default',
        urlParam: '',
        groups: '',

        rareIds: '',
        rareLabels: '',
        rareImpact: impact,
        rareLikelihood: 1,

        unlikelyIds: '',
        unlikelyLabels: '',
        unlikelyImpact: impact,
        unlikelyLikelihood: 2,

        evenChanceIds: '',
        evenChanceLabels: '',
        evenChanceImpact: impact,
        evenChanceLikelihood: 3,

        likelyIds: '',
        likelyLabels: '',
        likelyImpact: impact,
        likelyLikelihood: 4,

        almostCertainIds: '',
        almostCertainLabels: '',
        almostCertainImpact: impact,
        almostCertainLikelihood: 5,
    };
};

export const RiskChart = (props: RiskChartProps) => {
    const riskItems = new Array<RiskItem>();
    riskItems.push(createRiskItem('Extreme (5)', 5));
    riskItems.push(createRiskItem('Very High (4)', 4));
    riskItems.push(createRiskItem('High (3)', 3));
    riskItems.push(createRiskItem('Medium (2)', 2));
    riskItems.push(createRiskItem('Low (1)', 1));
    props.items.forEach((item) => {
        const semaphoreInfo = getSemaphoreInfo({
            impact: item.impact,
            likelihood: item.likelihood,
        });
        const riskItem = riskItems[semaphoreInfo.impactIndex];
        riskItem.groups =
            riskItem.groups === ''
                ? item.groups
                : `${riskItem.groups};${item.groups}`;
        riskItem.urlParam =
            riskItem.urlParam === ''
                ? item.urlParam
                : `${riskItem.urlParam};${item.urlParam}`;
        if (semaphoreInfo.likelihoodIndex === 0) {
            riskItem.rareLabels =
                riskItem.rareLabels === ''
                    ? item.label
                    : `${riskItem.rareLabels},${item.label}`;
            riskItem.rareIds =
                riskItem.rareIds === ''
                    ? item.id
                    : `${riskItem.rareIds},${item.id}`;
        }
        if (semaphoreInfo.likelihoodIndex === 1) {
            riskItem.unlikelyLabels =
                riskItem.unlikelyLabels === ''
                    ? item.label
                    : `${riskItem.unlikelyLabels},${item.label}`;
            riskItem.unlikelyIds =
                riskItem.unlikelyIds === ''
                    ? item.id
                    : `${riskItem.unlikelyIds},${item.id}`;
        }
        if (semaphoreInfo.likelihoodIndex === 2) {
            riskItem.evenChanceLabels =
                riskItem.evenChanceLabels === ''
                    ? item.label
                    : `${riskItem.evenChanceLabels},${item.label}`;
            riskItem.evenChanceIds =
                riskItem.evenChanceIds === ''
                    ? item.id
                    : `${riskItem.evenChanceIds},${item.id}`;
        }
        if (semaphoreInfo.likelihoodIndex === 3) {
            riskItem.likelyLabels =
                riskItem.likelyLabels === ''
                    ? item.label
                    : `${riskItem.likelyLabels},${item.label}`;
            riskItem.likelyIds =
                riskItem.likelyIds === ''
                    ? item.id
                    : `${riskItem.likelyIds},${item.id}`;
        }
        if (semaphoreInfo.likelihoodIndex === 4) {
            riskItem.almostCertainLabels =
                riskItem.almostCertainLabels === ''
                    ? item.label
                    : `${riskItem.almostCertainLabels},${item.label}`;
            riskItem.almostCertainIds =
                riskItem.almostCertainIds === ''
                    ? item.id
                    : `${riskItem.almostCertainIds},${item.id}`;
        }
    });
    return (
        <GenericList
            defaultRowsPerPage={5}
            headCells={headCells}
            items={riskItems}
            title="Groups Risk Chart"
        />
    );
};
