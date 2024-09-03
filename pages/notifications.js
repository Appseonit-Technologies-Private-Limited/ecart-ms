import Head from 'next/head'
import Notifications from '../components/Notifications/Notifications';


const notifications = () => {

    return (
        <div className="container justify-content-between">
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Notifications`}</title>
            </Head>
            <Notifications />
        </div>
    );
}
export default notifications;