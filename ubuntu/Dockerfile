
FROM ubuntu:20.04

RUN apt-get update
ARG DEBIAN_FRONTEND=noninteractive
# RUN apt-get install -y libgtk-3-dev webkit2gtk-4.0
RUN apt-get install -y libappindicator3-dev librsvg2-dev
RUN apt-get install -y patchelf pkg-config
RUN apt-get install -y curl
RUN apt-get install -y libatomic1
RUN curl https://tea.xyz -o ./tea.sh
RUN chmod +x tea.sh
RUN ./tea.sh --yes
# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]