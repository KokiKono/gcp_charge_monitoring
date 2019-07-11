# PubSubの作成
export PUBSUB_TOPIC_NAME='charge_alert'

echo create pubsub topic name is $PUBSUB_TOPIC_NAME
gcloud pubsub topics create $PUBSUB_TOPIC_NAME

export FUNCTION_NAME='helloPubSub'
echo cloud functions deploy $FUNCTION_NAME --trigger-topic $PUBSUB_TOPIC_NAME
gcloud beta functions deploy $FUNCTION_NAME --trigger-topic $PUBSUB_TOPIC_NAME