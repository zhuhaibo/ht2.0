#!/bin/bash

#部署服务

serve_name='clm-web'
server_env=''
#仓库地址
docker_registry="registry.cn-huhehaote.aliyuncs.com"
#命名空间
docker_namespace="kazakhstan"
#镜像tag
docker_tag=''
#镜像名称
docker_image=''

echo "start to deploy..."

echo "1. test"
echo "2. prod"
echo "other. key to exit"
read -r -p "请选择部署的环境：" env

case $env in
1)
echo "开始部署test环境"
server_env='qa'
;;
2)
echo "开始部署prod环境"
server_env='prod'
;;
*)
echo "请选择正确的环境"
exit 1
;;
esac


if [ $server_env == 'qa' ]; then
    docker_tag="TEST-$(date "+%Y%m%d%H%M%S")"
    else
    docker_tag="PROD-$(date "+%Y%m%d%H%M%S")"
fi

#构建打包
yarn run build:$server_env

docker_image="$docker_registry/$docker_namespace/$serve_name:$docker_tag"
printf "%s \n" "docker_tag: $docker_tag"
printf "%s \n" "开始构建镜像************************************************"
printf "%s \n" "构建命令: docker build -t $docker_image --build-arg ENV_TYPE=$server_env -f Dockerfile . --platform=amd64"
docker build -t "$docker_image" --build-arg ENV_TYPE=$server_env -f Dockerfile .
printf "%s \n" "构建镜像完成************************************************"
printf "%s \n" "开始推送镜像************************************************"
docker push "$docker_image"
printf "%s \n" "推送镜像完成************************************************"
printf "%s \n" "部署标记: $docker_registry/$docker_namespace/$serve_name:$docker_tag "

printf "%s\n" "部署命令："
printf "%s \n" "docker stop $serve_name && docker rm $serve_name"
printf "%s\n" "docker run -p 8113:80 \\"
printf "%s\n" "--name $serve_name \\"
printf "%s\n" "-d --restart=always \\"
printf "%s\n" "-v /etc/localtime:/etc/localtime \\"
printf "%s \n" "$docker_image"

#docker_container_name=$serve_name-$(date "+%Y%m%d%H%M%S")
#
#ssh root@39.104.28.126 > /dev/null 2>&1 << eeooff
#sh /data/deploys/$serve_name.sh $serve_name $docker_container_name $docker_image
#eeooff
#echo done!
