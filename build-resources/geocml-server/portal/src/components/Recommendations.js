import axios from "axios";
import { setRecommendations } from "../app-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function collectRecommendations(dispatch, wmsInfo) {
    const tags = []
    for (const [_, value] of Object.entries(wmsInfo.WMS_Capabilities.Service.KeywordList)) {
        for (let i = 1; i < value.length; i++) {
            tags.push(value[i])
        }
    }

    axios.get(`${process.env.REACT_APP_DRGON_HOST}/recommendations`, {
        params: {
            "tags": tags.join(","),
            "limit": 10
        }
    }).then((res) => {
        dispatch(setRecommendations(res.data.deployments))
    })
}

export function Recommendations() {
    const dispatch = useDispatch()
    const wmsInfo = useSelector((state) => state.app.wmsInfo)
    const recommendations = useSelector((state) => state.app.recommendations)

    useEffect(() => {
        collectRecommendations(dispatch, wmsInfo)
    }, [])

    return (
        recommendations.length > 0 ? (
            <div className="px-2 py-5 table-responsive">
                <h3 className="row justify-content-center pt-2">Explore Similar Datasets</h3>
                <i className="row justify-content-center pb-3">Results powered by DRGON</i>
                <table id="drgon-recommendations" className="table">
                    <tbody>
                        { recommendations.map((recommendation) => {
                            return (
                                <tr className="py-2">
                                    <div>
                                        <span className="font-weight-light">
                                            <a href={recommendation[0].url}>{recommendation[0].url}</a> | {recommendation[0].owner}
                                        </span>
                                        <h3>{recommendation[0].title}</h3>
                                        <p>{recommendation[0].description}</p>
                                        <p className="font-italic">Tags: {recommendation[0].tags}</p>
                                    </div>
                                </tr>
                            )
                        }) }
                    </tbody>
                </table>
            </div>
        ) : (
            <div></div>
        )
    )
}

