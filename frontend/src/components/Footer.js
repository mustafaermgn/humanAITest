import React from 'react';
import { Code, User, Mail } from 'lucide-react';
import { Button } from './ui/Button';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Human AI Test. Built by{" "}
            <a
              href="https://github.com/mustafaermgn"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Mustafa Ermeğan
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/mustafaermgn/humanAITest"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/mustafaermgn/humanAITest" target="_blank" rel="noreferrer">
              <Code className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://www.linkedin.com/in/mustafa-erme%C4%9Fan-162073223/" target="_blank" rel="noreferrer">
              <User className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:contact@example.com">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
