# eval-speechインフラ

## 構成
EC2 1台、RDS 1台の構成。EC2に付けたEIPがアクセス用のIPになる。

## AMI生成
docker-composeがインストールされたAMIを、PackerとAnsibleで生成する。

コマンドは以下。
```
cd packer
packer build -var-file=variables.json main.json
```

## インフラプロビジョニング
```
cd terraform
terraform apply
```

## Actionsのための設定
secretsの`SSH_ADDR`を`terraform apply`後にアウトプットされる`eip_id`に更新。

secretsの`SECURITY_GROUP_ID`をterraformで生成したssh用のセキュリティグループのIDに更新（アウトプットされないのでコンソールから確認）。