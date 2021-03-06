import React, { memo, useEffect } from "react";
import List from "@material-ui/core/List";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVisualisationAsync,
  getCrudStatus,
  getVisualisationDataById,
  getVisualisationsAsync,
  getVisualizations,
} from "../redux/ui/uiSlice";
import VisualizationItem from "./VisualizationItem";
import { getIsAuthenticated, getStrategy } from "../redux/user/userSlice";
import FriendlyBanner from "../components/FriendlyBanner";
import Loader from "./Loader";
import { Typography } from "@material-ui/core";

export default memo(function VisualizationsList() {
  const vis = useSelector(getVisualizations);
  const dispatch = useDispatch();
  const isAuth = useSelector(getIsAuthenticated);
  const strategy = useSelector(getStrategy);
  const crudStatus = useSelector(getCrudStatus);

  useEffect(() => {
    if (isAuth) {
      dispatch(getVisualisationsAsync(strategy));
    }
  }, [isAuth, dispatch, strategy]);

  if (!isAuth) return <FriendlyBanner />;

  if (crudStatus === "loading")
    return (
      <FriendlyBanner>
        <Loader />
      </FriendlyBanner>
    );

  if (!vis.length)
    return (
      <FriendlyBanner>
        <Typography>Empty.</Typography>
      </FriendlyBanner>
    );
  return (
    <List disablePadding={true}>
      {vis.map((e) => {
        return (
          <VisualizationItem
            key={e._id}
            name={e.name}
            type={e.type}
            handleListButtonClick={() =>
              dispatch(getVisualisationDataById({ _id: e._id, strategy }))
            }
            handleTrashClick={() =>
              dispatch(deleteVisualisationAsync({ _id: e._id, strategy }))
            }
          />
        );
      })}
    </List>
  );
});
