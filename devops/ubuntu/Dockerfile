
FROM ubuntu:20.04

RUN apt-get update
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y libgtk-3-dev webkit2gtk-4.0-dev
RUN apt install -y --fix-missing libappindicator3-dev librsvg2-dev
RUN apt install -y --fix-missing patchelf pkg-config curl libatomic1 gcc-multilib libsoup-gnome2.4-dev
RUN apt-get install -y libjavascriptcoregtk-4.0-dev wget
RUN apt-get install -y appstream
RUN curl https://tea.xyz -o ./tea.sh
RUN chmod +x tea.sh
RUN ./tea.sh --yes
RUN mkdir /mock
COPY README.md /mock/README.mkdir
RUN cd /mock && tea -SE xc setup
# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]