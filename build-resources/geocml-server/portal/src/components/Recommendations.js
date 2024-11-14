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
			<div>
				<h3 className="row justify-content-center pt-5">Explore Similar Datasets</h3>
				<i className="row justify-content-center pb-2">Results powered by DRGON</i>
				<table id="drgon-recommendations" className="table table-responsive" style={{ width: "100%" }}>
					<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Owner</th>
							<th>URL</th>
							<th>Tags</th>
						</tr>
					</thead>
					<tbody>
						{ recommendations.map((recommendation) => {
							return (
								<tr>
									<td>
										{recommendation[0].title}
									</td>
									<td>
										{recommendation[0].description}
									</td>
									<td>
										{recommendation[0].owner}
									</td>
									<td>
										<a href={recommendation[0].url}>{recommendation[0].url}</a>
									</td>
								<td>{recommendation[0].tags.split(",").map((tag) => {
									return (
										<span className="rounded bg-info p-2 mx-2">{tag}</span>
									)
								})}</td>
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

