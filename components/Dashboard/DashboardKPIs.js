
import c3 from "c3";
import 'c3/c3.css';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { REGISTERED_CUSTOMERS, TICK_FORMAT, TOTAL_ORDERS } from "../../utils/constants";
import DateRangeSelector from "../Custom_Components/DateRangeSelector";
import { postData } from "../../utils/fetchData";
import isEmpty from 'lodash/isEmpty';
import { addDays, format } from 'date-fns'
import { convertHTMLToPDFAndDownload } from "../../utils/HTMLToPDF";

const DashboardKPIs = ({ kpiData, auth, dispatch }) => {
    const router = useRouter()
    const [saKpi, setSaKpi] = useState({})
    const colPalette = ['#e48c16', '#265584', '#00b300', '#ce1141', '#703ba1', '#ffd650'];
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date('07-25-2021 00:00:00'),
            endDate: addDays(new Date('07-14-2021 00:00:00'), 25),
            key: 'selection'
        }
    ])

    useEffect(() => {
        if (kpiData && kpiData.charts && kpiData.charts.length > 0) {
            kpiData.charts.forEach(kpi => {
                if (kpi.singleAnalysis) setSaKpi(kpi);
                else {
                    c3.generate({
                        bindto: `#${kpi.id}`,
                        data: kpi.data
                    });
                }
            });
        }
    }, [kpiData])

    const handleOnClickCard = (kpiName) => {
        switch (kpiName) {
            case TOTAL_ORDERS:
                router.push('/orders');
                break;
            case REGISTERED_CUSTOMERS:
                router.push('/users');
                break;
            default:
                break;
        }
    }

    const getAndGenerateSAChartByDateRange = async (dates) => {
        const res = await postData('kpi', { dateRange: dates, kpi: saKpi }, auth.token)
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

        if (!isEmpty(res.kpiData)) {
            c3.generate({
                bindto: `#${saKpi.id}`,
                data: {
                    ...res.kpiData.data,
                    onclick: (d, element) => {
                        router.push({
                            pathname: '/orders',
                            query: { st: format(d.x, 'MM-dd-yyyy') }
                        }, '/orders', { scroll: true })
                    }
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            fit: false, rotate: -50, format: TICK_FORMAT
                        }
                    }
                },
                bar: { width: { ratio: 0.5 } }, // this makes bar width 50% of length between ticks
                tooltip: { grouped: false },
                grid: {
                    x: { show: true }, y: { show: true }
                }
            });
        } else {
            return dispatch({ type: 'NOTIFY', payload: { error: 'No data found for selected time range.' } });
        }
    }

    useEffect(() => {
        if (!isEmpty(dateRange) && !isEmpty(saKpi)) getAndGenerateSAChartByDateRange(dateRange);
    }, [dateRange, saKpi])

    return (
        <div className="pl-3">
            <div className="row">
                {
                    kpiData && kpiData.cards && kpiData.cards.map((kpi, i) => (
                        <div key={kpi.id} className="column dashboard-cards" onClick={() => { handleOnClickCard(kpi.name) }}>
                            <h5 className="mb-0 font-weight-bold" style={{ color: colPalette[i] }}>{kpi.data}</h5>
                            <span style={{ fontSize: "13px", fontWeight: "600" }}>{kpi.name}</span>
                        </div>
                    ))
                }
            </div>
            <div className="mt-4 row">
                {kpiData && kpiData.charts && kpiData.charts.map(kpi => (
                    <div key={kpi.id}>
                        {!kpi.singleAnalysis &&
                            <div key={kpi.id} className="column dashboard-charts">
                                <span style={{ fontSize: "13px", fontWeight: "600" }}>{kpi.name}</span>
                                <div style={{ height: "180px", margin: "1em auto" }} id={kpi.id}></div>
                            </div>
                        }
                    </div>
                ))
                }
            </div>
            {
                saKpi &&
                <div className="container dashboard-analytics-charts">
                    <div className="pt-2 dateRange-filter">
                        <div>
                            <DateRangeSelector handleSelect={(range) => { setDateRange(range) }} defaultRange={dateRange} />
                        </div>
                        <div className="pl-1">
                            <a className='btn btn-primary' onClick={() => { convertHTMLToPDFAndDownload('download-SA-id', saKpi.name + ' Report') }} title="Download as PDF"><i className="fas fa-file-download"></i></a>
                        </div>
                    </div>
                    <div id="download-SA-id" className="pt-4">
                        <div>
                            <h5>{saKpi.name}</h5>
                        </div>
                        <div className="pt-2" style={{ height: "400px" }} id={saKpi.id}></div>
                    </div>
                </div>
            }
        </div>
    );
}

export default DashboardKPIs