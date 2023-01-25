
FROM ubuntu:20.04

RUN apt-get update
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y libgtk-3-dev webkit2gtk-4.0
RUN apt-get install -y --fix-missing libappindicator3-dev librsvg2-dev
RUN apt-get install -y --fix-missing patchelf pkg-config curl libatomic1 gcc-multilib libsoup-gnome2.4
RUN apt-get install -y libjavascriptcoregtk-4.0-dev wget

RUN curl https://tea.xyz -o ./tea.sh
RUN chmod +x tea.sh
RUN ./tea.sh --yes

RUN mkdir -p /tmp/app/.git
COPY README.md /tmp/app/README.md
COPY package.json /tmp/app/package.json

RUN tea +nodejs.org
RUN tea +pnpm.io
RUN tea +rust-lang.org
RUN tea +rust-lang.org/cargo
RUN tea +xcfile.dev

# Code file to execute when the docker container starts up (`entrypoint.sh`)
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]