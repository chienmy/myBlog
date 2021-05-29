---
title: curl: (77) error setting certificate verify locations
date: 2021-05-19 21:53:50
state: post
categories:
  - 错误排查
tags:
  - shell
---

# curl: (77) error setting certificate verify locations

尝试1：安装`ca-certificates`

```bash
pacman -S ca-certificates
```

尝试2：安装`ca-certificates-utils`

```bash
pacman -S ca-certificates-utils
```

和上一个似乎差不多

尝试3：使用环境变量指定CA证书位置，成功

```bash
export CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```

curl会使用环境变量`CURL_CA_BUNDLE`指定的证书位置。

## 参考资料

[StackOverFlow - How do I deal with certificates using cURL while trying to access an HTTPS url?](https://stackoverflow.com/questions/3160909/how-do-i-deal-with-certificates-using-curl-while-trying-to-access-an-https-url)

[Curl Doc - SSL Certificate Verification](https://curl.se/docs/sslcerts.html)