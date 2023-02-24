import mixpanel from 'mixpanel-browser';
import * as pub from '$env/static/public';
import { getSession } from '@native';
import type { Session } from '$libs/types';

let session: Session;
const getLocalSession = async () => {
  if (session) return session;
  session = await getSession();
  return session;
}

mixpanel.init(pub.PUBLIC_MIXPANEL_TOKEN, {debug: true});

export enum AnalyticsAction {
  install = "INSTALL_ACTION"
}

export const trackAction = (action: AnalyticsAction, data?: { [key:string]: any }) => {

}